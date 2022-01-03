import { ParseClientService } from './../../parse-client.service';

import { Injectable } from '@nestjs/common';

@Injectable()
export class ParseAccountLoginStrategy {
  constructor(private client: ParseClientService) {}
  exec() {
    return this.client.exec('login');
  }
}
