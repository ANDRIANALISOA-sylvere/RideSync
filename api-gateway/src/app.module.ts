import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, UserService],
})
export class AppModule {}
