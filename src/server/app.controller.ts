import { Controller, Get, Post, Body, Render } from '@nestjs/common';
import { AppService } from './app.service';
import type { SssBody, Hash } from '../shared/types';

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

  @Post('/api/watch-transaction')
  public async watchTransaction(@Body() hash: Hash) {
    try {
      const result = await this.appService.watchTransaction(hash.hash);
      return result;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
