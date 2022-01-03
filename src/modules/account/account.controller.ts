import { CreateAccountDto } from './dto/create-account.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/')
  create(@Body('data') data: CreateAccountDto) {
    return this.accountService.create(data);
  }

  @Get('/')
  get(@Query('page') page: number) {
    return this.accountService.find({}, page);
  }
  @Post('find')
  find(@Body() query: any, @Query('page') page: number) {
    return this.accountService.find(query, page);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(id);
  }
}
