import { SearchIndexName } from './../../constants';
import { Module, OnModuleInit } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import {
  ElasticsearchModule,
  ElasticsearchService,
} from '@nestjs/elasticsearch';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: 'http://localhost:9200',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(private readonly elasticService: ElasticsearchService) {}
  async onModuleInit() {
    // await this.elasticService.create({
    //   index: SearchIndexName,
    // });
    console.log('init index')
  }
}
