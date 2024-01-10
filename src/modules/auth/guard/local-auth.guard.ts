import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthStrategy } from '../enum/strategy.enum';

@Injectable()
export class LocalAuthGuard extends AuthGuard(AuthStrategy.LOCAL) {}
