import { CreateAccountDto } from './dto/create-account.dto';
import { Account, AccountDocument } from './account.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AccountService {
  constructor(
    @InjectModel(Account.name) private accountModel: Model<AccountDocument>,
  ) {}

  async isExist(username: string) {
    return this.accountModel.exists({ username });
  }
  async create(createAccountDto: CreateAccountDto): Promise<Account> {
    const createdAccount = new this.accountModel(createAccountDto);
    return createdAccount.save();
  }
  async find(query: any, page: number) {
    const perPage = 25;
    page = page >= 1 ? page : 1;

    page = page - 1;
    const items = await this.accountModel
      .find(query)
      .limit(perPage)
      .skip(perPage * page);
    const total = await this.accountModel.countDocuments(query);
    return {
      data: items,
      meta: {
        perPage,
        total,
      },
    };
  }
  async like(id: string) {
    const item = await this.accountModel.findById(id);
    item.likes++;
    return await item.save();
  }
  async remove(id: string) {
    return this.accountModel.deleteOne({ _id: id });
  }
}
