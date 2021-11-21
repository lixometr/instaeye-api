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
@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost/instaeye'),
    // SearchModule,
    DetectModule,
    ParseModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
