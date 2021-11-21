import { Controller } from '@nestjs/common';
import { DataProviderService } from './data-provider.service';

@Controller('data-provider')
export class DataProviderController {
  constructor(private readonly dataProviderService: DataProviderService) {}
}
