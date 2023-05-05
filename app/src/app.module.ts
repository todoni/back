import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import entities from '@util/entity';
import { envConfig } from '@config/config';
import { AuthModule } from '@module/auth.module';
import { UserModule } from '@module/user.module';
import GatewayModule from '@module/gateway.module';
import ServiceModule from '@module/service.module';
import SessionModule from '@module/session.module';

@Module({
  imports: [
    AuthModule,
    JwtModule,
    UserModule,
    GatewayModule,
    ServiceModule,
    SessionModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [envConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('dbConfig.host'),
        port: configService.get<number>('dbConfig.port'),
        username: configService.get<string>('dbConfig.name'),
        password: configService.get<string>('dbConfig.password'),
        database: configService.get<string>('dbConfig.dbname'),
        entities: [...entities],
        synchronize: true,
      }),
    }),
  ],
})
class AppModule {}

export default AppModule;
