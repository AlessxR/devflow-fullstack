import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.users.login(dto);
  }
}
