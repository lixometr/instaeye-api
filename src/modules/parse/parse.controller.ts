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
  @Get('account/:username')
  parseAccount(@Param('username') username: string, @Req() req: Request) {
    // console.log(req.headers);
    // return req.headers;

    return this.parseService.parseAccount(username);
  }
  @Post('crowd')
  parseCrowd(@Body('items') items: string[]) {
    return this.parseService.crowd(items);
  }


  @Post('pause')
  parsePause() {
    return this.parseService.parsePause();
  }
  @Post('continue')
  parseContinue() {
    return this.parseService.parseContinue();
  }
  @Post('clear')
  parseClear() {
    return this.parseService.parseClear();
  }
  @Get('count')
  getCount() {
    return this.parseService.getCount();
  }
  @Get('status')
  getStatus() {
    return this.parseService.getStatus();
  }

  @Post('add')
  parseAdd(@Body() data: any) {
    return this.parseService.parseAdd(data);
  }
}
