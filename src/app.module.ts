import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapeModule } from './scrape/scrape.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'vocabiliary-model-client', 'dist'),
      exclude: ['/api*'],
    }),
    ScrapeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
