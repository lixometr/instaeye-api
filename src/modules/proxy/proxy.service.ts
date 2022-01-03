import { Injectable } from '@nestjs/common';

@Injectable()
export class ProxyService {
  proxyImage(path: string) {
      console.log('got')
      return '1'

  }
}
