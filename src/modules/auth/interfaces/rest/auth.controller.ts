import { Controller, Post, Body, Get, Param, Delete, Query, UseGuards, UseFilters } from '@nestjs/common';
import { AuthService } from '../../applications/services/auth.service';
import { SignInDto } from '../dto/sign-in.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @Post()
  async createTransaction(@Body() signInDto: SignInDto) {
    return await this.authService.login(signInDto.email, signInDto.password);
  }
}