import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { UserEntity } from '../entities/user.entity';

export interface IUserService {
  createUser(dto: CreateUserDto): Promise<UserResponseDto>;
  getUserByEmail(email: string): Promise<UserEntity | null>;
  getUserById(userId: string): Promise<UserResponseDto | null>;
}
