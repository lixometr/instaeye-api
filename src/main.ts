import { logger } from 'src/helpers/logger';
require('dotenv').config();
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cluster from 'cluster';
import * as os from 'os';
import { config } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  if (process.env.isFacade) {
    await app.listen(port);
    console.log('running on ' + port);
  } else {
    await app.init();
  }
}
if (cluster.isMaster && config.useClaster) {
  const cpuCount = os.cpus().length;

  cluster.fork({ isFacade: true });

  for (let i = 0; i < cpuCount - 1; i += 1) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    logger.info('Worker ' + worker.process.pid + ' is online.');
  });
  cluster.on('exit', ({ process }, code, signal) => {
    logger.info('worker ' + process.pid + ' died.');
  });
} else {
  bootstrap();
}
