import { PartialType } from '@nestjs/swagger';
import { CreateAppreciationDto } from './create-appreciation.dto';

export class UpdateAppreciationDto extends PartialType(CreateAppreciationDto) {}