
import { Controller, Get, Post, Body, HttpException, HttpStatus, NotFoundException, UseFilters, ValidationPipe } from '@nestjs/common';
import { CreateCatDto } from 'src/dto/create-cat.dto';


import { CatsService } from 'src/service/cat.service';
import { Cat } from 'src/interface/cat.interface';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';
import { Param } from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from 'src/pipe/joi.validation.pipe';

@Controller('cats')
// @UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body(new ValidationPipe({transform: true})) createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  // @Post()
  // async create(@Body(ValidationPipe) createCatDto: CreateCatDto) {
  //   this.catsService.create(createCatDto);
  // }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Get()
  async findOne2(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
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