import { UserResponseDto } from 'src/users/dtos/user-response.dto';
import { AuthDto } from '../dtos/auth.dto';
import type { Response } from 'express';
import { AuthenticatedRequest } from 'src/types/authenticated-request';

export interface IAuthService {
  login(dto: AuthDto, res: Response): Promise<void>;
  logout(res: Response): Promise<void>;
  me(
    res: AuthenticatedRequest,
  ): Promise<{ user: UserResponseDto | null; message: string }>;
}
