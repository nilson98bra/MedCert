import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import type { IUserService } from '../contracts/user.service.interface';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(@Inject('IUserService') private readonly service: IUserService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.service.createUser(dto);
  }
}
