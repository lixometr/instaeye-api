import { PartialType } from '@nestjs/mapped-types';
import { CreateInnerProxyDto } from './create-inner-proxy.dto';

export class UpdateInnerProxyDto extends PartialType(CreateInnerProxyDto) {}
