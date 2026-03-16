import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { databaseConfig } from './config/database.config';
import { UserEntity } from './user/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxyController } from './proxy/proxy.controller';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'ridesync-secret-dev',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AppController, AuthController, ProxyController],
  providers: [AppService, AuthService, UserService, JwtStrategy],
})
export class AppModule {}
