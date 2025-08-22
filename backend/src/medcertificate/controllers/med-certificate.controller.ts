import {
  Body,
  Controller,
  Inject,
  Post,
  Get,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateMedCertificateDto } from '../dtos/create-med-certificate.dto';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';
import { AuthGuard } from '@nestjs/passport';
import type { IMedCertificateService } from '../contracts/med-certificate.service.interface';

@Controller('medical-certificates')
export class MedCertificateController {
  constructor(
    @Inject('IMedCertificateService')
    private readonly service: IMedCertificateService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() dto: CreateMedCertificateDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.createMedCertificate(dto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('cids')
  async getAllCids(
    @Req() req: AuthenticatedRequest,
    @Query('query') cid?: string,
  ) {
    return this.service.getAllCids(cid || '', req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getMedCertificates(
    @Req() req: AuthenticatedRequest,
    @Query('employeeName') name?: string,
    @Query('cid') role?: string,
    @Query('dateTimeInit') dateTimeInit?: string,
    @Query('dateTimeEnd') dateTimeEnd?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    console.log('teste ', {
      employeeName: name,
      cid: role,
      dateTimeInit,
      dateTimeEnd,
      page,
      limit,
    });
    const result = await this.service.getMedCertificates(req.user.userId, {
      employeeName: name,
      cid: role,
      dateTimeInit,
      dateTimeEnd,
      page,
      limit,
    });

    return result;
  }
}
