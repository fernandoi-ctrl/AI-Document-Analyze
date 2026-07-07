import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { ConsultationStatus } from './enums/consultation-status.enum';
import { RequestUser } from '../../common/auth/auth-user.types';

const USER: RequestUser = { id: 'user-1', email: 'user@example.com' };

function makeServiceMock(): jest.Mocked<ConsultationsService> {
  return {
    list: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAvailability: jest.fn(),
  } as unknown as jest.Mocked<ConsultationsService>;
}

describe('ConsultationsController', () => {
  let service: jest.Mocked<ConsultationsService>;
  let controller: ConsultationsController;

  beforeEach(() => {
    service = makeServiceMock();
    controller = new ConsultationsController(service);
  });

  it('delegates list to the service', async () => {
    service.list.mockResolvedValue([]);
    await controller.list(USER);
    expect(service.list).toHaveBeenCalledWith(USER.id);
  });

  it('delegates findOne to the service', async () => {
    service.findOne.mockResolvedValue({
      id: 'c1',
      caseId: 'case',
      lawyerId: 'lawyer',
      userId: USER.id,
      scheduledAt: '2026-06-10T10:00:00.000Z',
      durationMinutes: 30,
      notes: null,
      meetingUrl: null,
      status: ConsultationStatus.PENDING,
      createdAt: '2026-06-01T00:00:00.000Z',
      updatedAt: '2026-06-01T00:00:00.000Z',
    });

    await controller.findOne(USER, 'c1');
    expect(service.findOne).toHaveBeenCalledWith('c1', USER.id);
  });

  it('delegates create to the service', async () => {
    const dto = {
      caseId: 'case',
      lawyerId: 'lawyer',
      scheduledAt: '2026-06-10T10:00:00.000Z',
    };
    await controller.create(USER, dto);
    expect(service.create).toHaveBeenCalledWith(USER.id, dto);
  });

  it('delegates update to the service', async () => {
    const dto = { notes: 'updated' };
    await controller.update(USER, 'c1', dto);
    expect(service.update).toHaveBeenCalledWith('c1', USER.id, dto);
  });

  it('delegates remove to the service', async () => {
    await controller.remove(USER, 'c1');
    expect(service.remove).toHaveBeenCalledWith('c1', USER.id);
  });

  it('delegates availability to the service', async () => {
    service.getAvailability.mockResolvedValue([]);
    await controller.availability('lawyer-1', { date: '2026-06-10' });
    expect(service.getAvailability).toHaveBeenCalledWith('lawyer-1', { date: '2026-06-10' });
  });
});
