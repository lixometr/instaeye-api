import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchIndexName } from 'src/constants';

@Injectable()
export class SearchService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async index(data: any) {
    await this.elasticsearchService.index({
      index: SearchIndexName,
      body: data,
    });
  }
  async search() {
    return await this.elasticsearchService.search({
      index: SearchIndexName,
      //   body: {
      //     query: {
      //         match: { quote: 'winter' }
      //     },
      //   },
    });
  }
}
