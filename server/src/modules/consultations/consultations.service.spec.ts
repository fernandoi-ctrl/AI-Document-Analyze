import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConsultationsService } from './consultations.service';
import { ConsultationsMapper, ConsultationRow } from './consultations.mapper';
import { ConsultationsRepository, LawyerRow } from './consultations.repository';
import { ConsultationStatus } from './enums/consultation-status.enum';
import { CreateConsultationDto } from './dto/create-consultation.dto';

const USER_ID = '11111111-1111-1111-1111-111111111111';
const OTHER_USER_ID = '22222222-2222-2222-2222-222222222222';
const LAWYER_ID = '33333333-3333-3333-3333-333333333333';
const CASE_ID = '44444444-4444-4444-4444-444444444444';
const CONSULTATION_ID = '55555555-5555-5555-5555-555555555555';

const FAKE_NOW = new Date('2026-06-04T12:00:00.000Z').getTime();

function buildRow(overrides: Partial<ConsultationRow> = {}): ConsultationRow {
  return {
    id: CONSULTATION_ID,
    case_id: CASE_ID,
    lawyer_id: LAWYER_ID,
    user_id: USER_ID,
    scheduled_at: '2026-06-10T10:00:00.000Z',
    duration_minutes: 30,
    notes: null,
    meeting_url: null,
    status: ConsultationStatus.PENDING,
    created_at: '2026-06-01T00:00:00.000Z',
    updated_at: '2026-06-01T00:00:00.000Z',
    ...overrides,
  };
}

function buildLawyer(overrides: Partial<LawyerRow> = {}): LawyerRow {
  return {
    id: LAWYER_ID,
    user_id: 'lawyer-user-id',
    working_hours_start: 9,
    working_hours_end: 18,
    timezone: 'UTC',
    specialty: null,   // 👈 valor por defecto
    user: null,        // 👈 valor por defecto
    ...overrides,
  }
}

function makeRepoMock(): jest.Mocked<ConsultationsRepository> {
  return {
    listForUser: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    userExists: jest.fn(),
    findLawyerById: jest.fn(),
    findOverlapping: jest.fn(),
    listForLawyerOnDay: jest.fn(),
  } as unknown as jest.Mocked<ConsultationsRepository>;
}

describe('ConsultationsService', () => {
  let repo: jest.Mocked<ConsultationsRepository>;
  let service: ConsultationsService;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(FAKE_NOW));
    repo = makeRepoMock();
    service = new ConsultationsService(repo, new ConsultationsMapper());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('list', () => {
    it('returns mapped consultations for the user', async () => {
      repo.listForUser.mockResolvedValue([buildRow()]);

      const result = await service.list(USER_ID);

      expect(repo.listForUser).toHaveBeenCalledWith(USER_ID);
      expect(result).toEqual([
        expect.objectContaining({
          id: CONSULTATION_ID,
          caseId: CASE_ID,
          lawyerId: LAWYER_ID,
          userId: USER_ID,
          status: ConsultationStatus.PENDING,
        }),
      ]);
    });
  });

  describe('findOne', () => {
    it('returns the consultation when owned by the user', async () => {
      repo.findById.mockResolvedValue(buildRow());

      const result = await service.findOne(CONSULTATION_ID, USER_ID);

      expect(result.id).toBe(CONSULTATION_ID);
    });

    it('throws Forbidden when the consultation belongs to another user', async () => {
      repo.findById.mockResolvedValue(buildRow({ user_id: OTHER_USER_ID }));

      await expect(service.findOne(CONSULTATION_ID, USER_ID)).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });
  });

  describe('create', () => {
    const baseDto: CreateConsultationDto = {
      caseId: CASE_ID,
      lawyerId: LAWYER_ID,
      scheduledAt: '2026-06-10T10:00:00.000Z',
      durationMinutes: 30,
    };

    it('creates a consultation when validations pass', async () => {
      repo.userExists.mockResolvedValue(true);
      repo.findLawyerById.mockResolvedValue(buildLawyer());
      repo.findOverlapping.mockResolvedValue([]);
      repo.create.mockResolvedValue(buildRow());

      const result = await service.create(USER_ID, baseDto);

      expect(repo.userExists).toHaveBeenCalledWith(USER_ID);
      expect(repo.findLawyerById).toHaveBeenCalledWith(LAWYER_ID);
      expect(repo.findOverlapping).toHaveBeenCalledWith({
        lawyerId: LAWYER_ID,
        scheduledAt: new Date(baseDto.scheduledAt),
        durationMinutes: 30,
      });
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          case_id: CASE_ID,
          lawyer_id: LAWYER_ID,
          user_id: USER_ID,
          duration_minutes: 30,
          status: ConsultationStatus.PENDING,
        }),
      );
      expect(result.id).toBe(CONSULTATION_ID);
    });

    it('rejects past dates', async () => {
      await expect(
        service.create(USER_ID, { ...baseDto, scheduledAt: '2026-06-04T11:00:00.000Z' }),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(repo.create).not.toHaveBeenCalled();
    });

    it('rejects invalid dates', async () => {
      await expect(
        service.create(USER_ID, { ...baseDto, scheduledAt: 'not-a-date' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('throws NotFound when the user does not exist', async () => {
      repo.userExists.mockResolvedValue(false);
      repo.findLawyerById.mockResolvedValue(buildLawyer());

      await expect(service.create(USER_ID, baseDto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('throws NotFound when the lawyer does not exist', async () => {
      repo.userExists.mockResolvedValue(true);
      repo.findLawyerById.mockResolvedValue(null);

      await expect(service.create(USER_ID, baseDto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });

    it('throws Conflict when an overlapping consultation exists', async () => {
      repo.userExists.mockResolvedValue(true);
      repo.findLawyerById.mockResolvedValue(buildLawyer());
      repo.findOverlapping.mockResolvedValue([buildRow({ id: 'other' })]);

      await expect(service.create(USER_ID, baseDto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(repo.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('rejects empty payloads', async () => {
      await expect(service.update(CONSULTATION_ID, USER_ID, {})).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('re-validates overlap when rescheduling', async () => {
      repo.findById.mockResolvedValue(buildRow());
      repo.findOverlapping.mockResolvedValue([]);
      repo.update.mockResolvedValue(buildRow({ scheduled_at: '2026-06-11T10:00:00.000Z' }));

      const result = await service.update(CONSULTATION_ID, USER_ID, {
        scheduledAt: '2026-06-11T10:00:00.000Z',
      });

      expect(repo.findOverlapping).toHaveBeenCalledWith({
        lawyerId: LAWYER_ID,
        scheduledAt: new Date('2026-06-11T10:00:00.000Z'),
        durationMinutes: 30,
        excludeId: CONSULTATION_ID,
      });
      expect(result.scheduledAt).toBe('2026-06-11T10:00:00.000Z');
    });

    it('throws Conflict when rescheduling onto another booking', async () => {
      repo.findById.mockResolvedValue(buildRow());
      repo.findOverlapping.mockResolvedValue([buildRow({ id: 'other' })]);

      await expect(
        service.update(CONSULTATION_ID, USER_ID, {
          scheduledAt: '2026-06-11T10:00:00.000Z',
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('skips overlap check for status-only transitions to CANCELLED', async () => {
      repo.findById.mockResolvedValue(buildRow());
      repo.update.mockResolvedValue(buildRow({ status: ConsultationStatus.CANCELLED }));

      const result = await service.update(CONSULTATION_ID, USER_ID, {
        status: ConsultationStatus.CANCELLED,
      });

      expect(repo.findOverlapping).not.toHaveBeenCalled();
      expect(result.status).toBe(ConsultationStatus.CANCELLED);
    });

    it('rejects updates on COMPLETED consultations', async () => {
      repo.findById.mockResolvedValue(buildRow({ status: ConsultationStatus.COMPLETED }));

      await expect(
        service.update(CONSULTATION_ID, USER_ID, { notes: 'late edit' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('rejects updates from another user', async () => {
      repo.findById.mockResolvedValue(buildRow({ user_id: OTHER_USER_ID }));

      await expect(
        service.update(CONSULTATION_ID, USER_ID, { notes: 'hi' }),
      ).rejects.toBeInstanceOf(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('deletes an owned mutable consultation', async () => {
      repo.findById.mockResolvedValue(buildRow());
      repo.delete.mockResolvedValue(undefined);

      await service.remove(CONSULTATION_ID, USER_ID);

      expect(repo.delete).toHaveBeenCalledWith(CONSULTATION_ID);
    });

    it('refuses to delete a completed consultation', async () => {
      repo.findById.mockResolvedValue(buildRow({ status: ConsultationStatus.COMPLETED }));

      await expect(service.remove(CONSULTATION_ID, USER_ID)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(repo.delete).not.toHaveBeenCalled();
    });
  });

  describe('getAvailability', () => {
    it('throws NotFound when the lawyer does not exist', async () => {
      repo.findLawyerById.mockResolvedValue(null);

      await expect(
        service.getAvailability(LAWYER_ID, { date: '2026-06-10' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('returns slots for a clean day, skipping past slots', async () => {
      jest.setSystemTime(new Date('2026-06-10T10:30:00.000Z'));
      repo.findLawyerById.mockResolvedValue(
        buildLawyer({ working_hours_start: 10, working_hours_end: 12 }),
      );
      repo.listForLawyerOnDay.mockResolvedValue([]);

      const slots = await service.getAvailability(LAWYER_ID, {
        date: '2026-06-10',
        slotMinutes: 30,
      });

      expect(slots).toEqual([
        { start: '2026-06-10T11:00:00.000Z', end: '2026-06-10T11:30:00.000Z' },
        { start: '2026-06-10T11:30:00.000Z', end: '2026-06-10T12:00:00.000Z' },
      ]);
    });

    it('omits slots that overlap an existing booking', async () => {
      jest.setSystemTime(new Date('2026-06-09T00:00:00.000Z'));
      repo.findLawyerById.mockResolvedValue(
        buildLawyer({ working_hours_start: 10, working_hours_end: 12 }),
      );
      repo.listForLawyerOnDay.mockResolvedValue([
        buildRow({
          scheduled_at: '2026-06-10T10:30:00.000Z',
          duration_minutes: 30,
          status: ConsultationStatus.CONFIRMED,
        }),
      ]);

      const slots = await service.getAvailability(LAWYER_ID, {
        date: '2026-06-10',
        slotMinutes: 30,
      });

      expect(slots).toEqual([
        { start: '2026-06-10T10:00:00.000Z', end: '2026-06-10T10:30:00.000Z' },
        { start: '2026-06-10T11:00:00.000Z', end: '2026-06-10T11:30:00.000Z' },
        { start: '2026-06-10T11:30:00.000Z', end: '2026-06-10T12:00:00.000Z' },
      ]);
    });
  });
});
