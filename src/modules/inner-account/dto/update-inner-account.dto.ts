import { PartialType } from '@nestjs/mapped-types';
import { CreateInnerAccountDto } from './create-inner-account.dto';

export class UpdateInnerAccountDto extends PartialType(CreateInnerAccountDto) {}
