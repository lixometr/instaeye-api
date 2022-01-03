import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { InnerProxyService } from './inner-proxy.service';
import { CreateInnerProxyDto } from './dto/create-inner-proxy.dto';
import { UpdateInnerProxyDto } from './dto/update-inner-proxy.dto';

@Controller('inner-proxy')
export class InnerProxyController {
  constructor(private readonly innerProxyService: InnerProxyService) {}

  @Post()
  create(@Body() createInnerProxyDto: CreateInnerProxyDto) {
    return this.innerProxyService.create(createInnerProxyDto);
  }

  @Get()
  findAll() {
    return this.innerProxyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.innerProxyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateInnerProxyDto: UpdateInnerProxyDto) {
    return this.innerProxyService.update(id, updateInnerProxyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.innerProxyService.remove(id);
  }
}
