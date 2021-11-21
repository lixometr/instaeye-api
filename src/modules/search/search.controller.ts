import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}
  @Get('/')
  search() {
    return this.searchService.search();
  }

  @Get('/index')
  index() {
    return this.searchService.index({ test: true, name: 'hello' });
  }
}
