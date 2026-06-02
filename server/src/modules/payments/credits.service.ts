import { Injectable } from '@nestjs/common';
import { CreditsRepository } from './credits.repository';

@Injectable()
export class CreditsService {
  constructor(private readonly repo: CreditsRepository) {}

  read(userId: string): Promise<number> {
    return this.repo.read(userId);
  }

  consumeOne(userId: string): Promise<boolean> {
    return this.repo.tryDecrementOne(userId);
  }

  grant(userId: string, amount: number): Promise<void> {
    return this.repo.addCredits(userId, amount);
  }
}
