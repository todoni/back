import { Module } from '@nestjs/common';

import { UserModule } from '@module/user.module';
import ServiceModule from '@module/service.module';
import BaseGateway from '@gateway/base.gateway';
import { AuthModule } from './auth.module';

@Module({
  imports: [AuthModule, ServiceModule, UserModule],
  providers: [BaseGateway],
})
class GatewayModule {}

export default GatewayModule;
