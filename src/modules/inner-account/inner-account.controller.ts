import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { InnerAccountService } from './inner-account.service';
import { CreateInnerAccountDto } from './dto/create-inner-account.dto';
import { UpdateInnerAccountDto } from './dto/update-inner-account.dto';

@Controller('inner-account')
export class InnerAccountController {
  constructor(private readonly innerAccountService: InnerAccountService) {}

  @Post()
  create(@Body() createInnerAccountDto: CreateInnerAccountDto) {
    return this.innerAccountService.create(createInnerAccountDto);
  }

  @Get()
  findAll() {
    return this.innerAccountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.innerAccountService.findOne(id);
  }
  @Put(':id/make-active')
  makeActive(
    @Param('id') id: string,
  ) {
    return this.innerAccountService.makeActive(id);
  }
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInnerAccountDto: UpdateInnerAccountDto,
  ) {
    return this.innerAccountService.update(id, updateInnerAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.innerAccountService.remove(id);
  }
}
