import { BadRequestException, Injectable } from '@nestjs/common';
import { CaseInputDto } from './dto/case-input.dto';

export interface ValidatedCase {
  caseType: CaseInputDto['caseType'];
  description: string;
}

@Injectable()
export class CasesService {
  validate(input: CaseInputDto, hasDocuments: boolean): ValidatedCase {
    const description = input.description?.trim() ?? '';
    if (!description && !hasDocuments) {
      throw new BadRequestException(
        'Debes proporcionar una descripción o subir al menos un documento.',
      );
    }
    return { caseType: input.caseType, description };
  }
}
