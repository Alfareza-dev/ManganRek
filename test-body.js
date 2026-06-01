const { NestFactory } = require('@nestjs/core');
const { Controller, Post, Body, UseInterceptors, UploadedFile } = require('@nestjs/common');
const { FileInterceptor } = require('@nestjs/platform-express');

class TestDto {}

@Controller('test')
class TestController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  test(@Body() dto, @UploadedFile() file) {
    console.log('dto:', dto);
    console.log('file:', file?.originalname);
    return 'ok';
  }
}
// just testing if NestJS passes undefined or {}
