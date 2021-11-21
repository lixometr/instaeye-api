import { CreateAccountDto } from './dto/create-account.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('/')
  create(@Body('data') data: CreateAccountDto) {
    return this.accountService.create(data)
  }
}
