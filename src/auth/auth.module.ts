import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtModule } from '@nestjs/jwt';

import { jwtConfig } from '../common/environments/jwt-config.environment';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtDefaultStrategy } from './strategies/jwt-default.strategy';

@Module({
  providers: [
    AuthResolver, 
    AuthService,
    JwtDefaultStrategy
  ],
  imports: [

    ConfigModule,

    JwtModule.registerAsync( jwtConfig ),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    UsersModule,

  ],
  exports: [
    JwtModule,
    PassportModule,
    JwtDefaultStrategy
  ]
})
export class AuthModule {}
