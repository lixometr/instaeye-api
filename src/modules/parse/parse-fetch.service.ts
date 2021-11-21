import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class ParseFetchService {
  async fetch(url: string) {
    const res = await fetch(url);
    const response = await res.json();
    return response;
  }
}
