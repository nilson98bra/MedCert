import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from '../dtos/auth.dto';
import type { IAuthService } from '../contracts/auth.service.interface';
import type { Response } from 'express';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  constructor(@Inject('IAuthService') private readonly service: IAuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.service.login(authDto, res);
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Res() res: Response) {
    return await this.service.logout(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  @HttpCode(200)
  async me(@Req() req: AuthenticatedRequest) {
    return await this.service.me(req);
  }
}
