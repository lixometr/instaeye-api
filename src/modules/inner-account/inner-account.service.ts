import { ParseClientService } from './../parse/parse-client.service';
import { logger } from 'src/helpers/logger';
import { NoAccountsException } from './../../helpers/exceptions/no-accounts.exception';
import { InnerAccountDocument } from './../inner-account/inner-account.schema';
import {
  BadRequestException,
  Injectable,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { CreateInnerAccountDto } from './dto/create-inner-account.dto';
import { UpdateInnerAccountDto } from './dto/update-inner-account.dto';
import { InnerAccount } from './inner-account.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class InnerAccountService {
  constructor(
    @InjectModel(InnerAccount.name)
    private accountModel: Model<InnerAccountDocument>,
    @Inject(forwardRef(() => ParseClientService))
    private parseClientService: ParseClientService,
  ) {}
  async create(createInnerAccountDto: CreateInnerAccountDto) {
    const acc = new this.accountModel(createInnerAccountDto);
    return acc.save();
  }
  async changeActiveAccount(err?: any) {
    logger.info('<Change account>');
    // choose another active account
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 3);
    const account = await this.accountModel.findOne({
      $or: [
        {
          usedDate: {
            $exists: false,
          },
        },
        {
          usedDate: { $lt: cutoff },
        },
      ],
    });
    await this.disableActiveAccount(err?.message);
    if (!account) {
      logger.error('No accounts left');
      throw new NoAccountsException();
    }
    account.isActive = true;
    await account.save();
    logger.info('<Changed account to> ' + JSON.stringify(account.toJSON()));
    return true;
  }
  async disableActiveAccount(errMessage?: string) {
    const currentActive = await this.accountModel.findOne({ isActive: true });
    if (currentActive) {
      currentActive.isActive = false;
      currentActive.errorMessage = errMessage;
      currentActive.usedDate = new Date();
      await currentActive.save();
    }
  }
  async getActiveAccount() {
    const account = await this.accountModel.findOne({ isActive: true }, null, {
      populate: ['proxy'],
    });
    if (!account) {
      logger.error('No accounts left');
      throw new NoAccountsException();
    }
    return account;
  }
  async makeActive(id: string) {
    const account = await this.accountModel.findById(id);
    if (account.isActive) return id;
    if (!account) throw new BadRequestException();
    await this.disableActiveAccount();
    account.isActive = true;
    await account.save();
    await this.parseClientService.init();

    return id;
  }
  findAll() {
    return this.accountModel.find({}, null, { populate: ['proxy'] });
  }

  findOne(id: string) {
    return this.accountModel.findById(id);
  }

  update(id: string, updateInnerAccountDto: UpdateInnerAccountDto) {
    // @ts-ignore
    return this.accountModel.updateOne({ _id: id }, updateInnerAccountDto);
  }

  remove(id: string) {
    return this.accountModel.deleteOne({ _id: id });
  }
}
