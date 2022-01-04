import { InnerProxyModule } from './modules/inner-proxy/inner-proxy.module';
import { ProxyModule } from './modules/proxy/proxy.module';
import { AccountModule } from './modules/account/account.module';
import { ParseModule } from './modules/parse/parse.module';
// import { SearchModule } from './modules/search/search.module';
import { DetectModule } from './modules/detect/detect.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { InnerAccountModule } from './modules/inner-account/inner-account.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    BullModule.forRoot({
      defaultJobOptions: {
        removeOnComplete: true,
      },
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),

    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost/instaeye',
      {
        useCreateIndex: true,
      },
    ),
    // SearchModule,
    DetectModule,
    ParseModule,
    AccountModule,
    ProxyModule,
    InnerProxyModule,
    InnerAccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
