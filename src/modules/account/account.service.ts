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
  async find() {
    return this.accountModel.find();
  }
}
