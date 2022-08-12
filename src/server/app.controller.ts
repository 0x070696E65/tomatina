import { Controller, Get, Post, Body, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { SssBody } from '../shared/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  home() {
    return {};
  }

  @Post('/api/sss-token')
  public async getSssToken(@Body() sssBody: SssBody) {
    try {
      const result = await this.appService.getSssToken(sssBody);
      return result;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
