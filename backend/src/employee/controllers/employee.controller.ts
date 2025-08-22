import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Patch,
  Query,
  Req,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import type { IEmployeeService } from '../contracts/employee.service.interface';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeStatus } from '../enum/employee-status.enum';
import { AuthGuard } from '@nestjs/passport';
import type { AuthenticatedRequest } from 'src/types/authenticated-request';

@Controller('employees')
@UsePipes(new ValidationPipe({ transform: true }))
export class EmployeeController {
  constructor(
    @Inject('IEmployeeService') private readonly service: IEmployeeService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body() dto: CreateEmployeeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.service.createEmployee(dto, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getEmployees(
    @Req() req: AuthenticatedRequest,
    @Query('name') name?: string,
    @Query('role') role?: string,
    @Query('status') status?: EmployeeStatus,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.service.getEmployees(req.user.userId, {
      name,
      role,
      status,
      page,
      limit,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/status')
  async updateStatus(
    @Param('id') employeeId: string,
    @Body('status') status: string,
  ) {
    return this.service.updateEmployeeStatus(
      employeeId,
      status as EmployeeStatus,
    );
  }
}
