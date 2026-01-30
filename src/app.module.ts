import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './core/db/config/database.config';

@Module({
  imports: [MongooseModule.forRootAsync({useFactory:() => mongoConfig})],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
