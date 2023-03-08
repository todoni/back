
import { Controller, Get, Post, Body, HttpException, HttpStatus, NotFoundException, UseFilters } from '@nestjs/common';
import { CreateCatDto } from 'src/dto/create-cat.dto';


import { CatsService } from 'src/service/cat.service';
import { Cat } from 'src/interface/cat.interface';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';

@Controller('cats')
// @UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get("/test")
  test(): string {
    return "test";
  }

  @Get("/test/error")
  // @UseFilters(HttpExceptionFilter)
  throwError(): string {
    // throw new HttpException("custom message", HttpStatus.EXPECTATION_FAILED);
    throw new NotFoundException();
  }
}