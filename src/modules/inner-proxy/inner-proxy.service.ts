import { ConfigService } from '@nestjs/config';
import { InnerProxy, InnerProxyDocument } from './inner-proxy.schema';

import { Injectable } from '@nestjs/common';
import { CreateInnerProxyDto } from './dto/create-inner-proxy.dto';
import { UpdateInnerProxyDto } from './dto/update-inner-proxy.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InnerAccountService } from '../inner-account/inner-account.service';
import { config } from 'src/config/config';

@Injectable()
export class InnerProxyService {
  constructor(
    @InjectModel(InnerProxy.name)
    private proxyModel: Model<InnerProxyDocument>,
    private innerAccountService: InnerAccountService,
  ) {}
  async create(createInnerProxyDto: CreateInnerProxyDto) {
    const proxy = new this.proxyModel(createInnerProxyDto);
    return proxy.save();
  }
  async getProxyUrl() {
    const { username, password, host, port } = await this.getActiveProxy();
    return 'http://' + username + ':' + password + '@' + host + ':' + port;
  }
  async getActiveProxy() {
    const { proxy } = await this.innerAccountService.getActiveAccount();
    return proxy;
  }
  async getImageProxy() {
    return config.imageProxy;
  }
  async findAll() {
    return this.proxyModel.find();
  }

  async findOne(id: string) {
    return this.proxyModel.findById(id);
  }

  update(id: string, updateInnerProxyDto: UpdateInnerProxyDto) {
    return `This action updates a #${id} innerProxy`;
  }

  async remove(id: string) {
    return this.proxyModel.deleteOne({ _id: id });
  }
}
