import { Inject, Injectable, Req } from '@nestjs/common';
import type { Response } from 'express';
import { UnauthorizedError } from 'src/utils/errors/api-error.utils';
import type { IUserService } from '../../users/contracts/user.service.interface';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthDto } from '../dtos/auth.dto';
import { CryptoService } from 'src/common/crypto/crypto.service';
import { JwtService } from '@nestjs/jwt';

import type { AuthenticatedRequest } from 'src/types/authenticated-request';
import { IAuthService } from '../contracts/auth.service.interface';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject('IUserService') private readonly service: IUserService,
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
  ) {}

  async login(credentials: AuthDto, res: Response): Promise<void> {
    const { email, password } = credentials;
    const user = await this.service.getUserByEmail(email);
    if (!user) throw new UnauthorizedError('E-mail not found!');

    const isPasswordValid = await this.cryptoService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) throw new UnauthorizedError('Invalid password!');

    const tokenDuration = 4 * 24 * 60 * 60 * 1000;
    const token = await this.generateToken(user);
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: tokenDuration,
    });
    res.status(200).json({ message: 'Login successful' });
  }

  async logout(res: Response): Promise<void> {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    res.status(200).json({ message: 'Logout successful' });
  }

  async me(@Req() req: AuthenticatedRequest) {
    const user = await this.service.getUserById(req.user.userId);
    return {
      user,
      message: 'User retrieved successfully',
    };
  }

  private async generateToken(user: UserEntity): Promise<string> {
    const { _id, email } = user;
    return this.jwtService.sign({ sub: _id.toString(), email });
  }
}
