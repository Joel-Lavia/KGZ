import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './core/db/config/database.config';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({ useFactory: () => mongoConfig }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
