import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ParseService } from './parse.service';

@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService) {}
  @Get('test')
  parse() {
    return this.parseService.test();
  }
  @Get(':username')
  parseAccount(@Param('username') username: string) {
    return this.parseService.parseAccount(username);
  }
  @Post('crowd')
  parseCrowd(@Body('items') items: string[]) {
    return this.parseService.crowd(items);
  }
}
