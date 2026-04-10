import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './core/db/config/database.config';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtAuthGuard } from './core/guards/user.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({ useFactory: () => mongoConfig }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: JwtAuthGuard }],
})
export class AppModule {}
