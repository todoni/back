import { Controller, Get, Param } from '@nestjs/common';
import { TestService } from '@src/service/test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}
  @Get('init')
  async testInit(): Promise<object> {
    await this.testService.initData();
    return { status: 200 };
  }
}
