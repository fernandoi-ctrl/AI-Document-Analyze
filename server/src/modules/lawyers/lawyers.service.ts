import { Injectable } from '@nestjs/common';
import { LawyersRepository } from './lawyers.repository';
import { LawyersMapper } from './lawyers.mapper';
import { LawyerResponseDto } from './dto/lawyer-response.dto';

@Injectable()
export class LawyersService {
  constructor(
    private readonly repo: LawyersRepository,
    private readonly mapper: LawyersMapper,
  ) {}

  async list(): Promise<LawyerResponseDto[]> {
    const rows = await this.repo.list();
    return this.mapper.toResponseList(rows);
  }
}
