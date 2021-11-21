import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { ParseService } from './parse.service';

@Controller('parse')
export class ParseController {
  constructor(private readonly parseService: ParseService) {}
  @Get('test')
  parse() {
    return this.parseService.test();
  }
  @Get(':username')
  parseAccount(@Param('username') username: string, @Req() req: Request) {
    
    return req.headers;

    return this.parseService.parseAccount(username);
  }
  @Post('crowd')
  parseCrowd(@Body('items') items: string[]) {
    return this.parseService.crowd(items);
  }
}
