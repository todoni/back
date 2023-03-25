import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { Res, HttpCode, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
