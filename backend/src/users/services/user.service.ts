import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../contracts/user.repository.interface';
import { IUserService } from '../contracts/user.service.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserEntity } from '../entities/user.entity';
import { ConflictError } from 'src/utils/errors/api-error.utils';
import { CryptoService } from 'src/common/crypto/crypto.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository') private readonly repository: IUserRepository,
    private readonly cryptoService: CryptoService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
    if (dto.confirmPassword !== dto.password)
      throw new ConflictError('Passwords do not match');

    const existingUser = await this.repository.findByEmail(dto.email);
    if (existingUser) throw new ConflictError('Email already in use');

    dto.password = await this.cryptoService.hashPassword(dto.password);
    const user = await this.repository.create(dto);
    return this.mapToResponse(user);
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repository.findByEmail(email);
    return user;
  }

  async getUserById(id: string): Promise<UserResponseDto | null> {
    const user = await this.repository.findById(id);
    if (!user) return null;
    return this.mapToResponse(user);
  }

  private mapToResponse(user: UserEntity): UserResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
