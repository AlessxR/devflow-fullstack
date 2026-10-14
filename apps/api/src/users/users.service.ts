import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ email, name, password }: CreateUserDto) {
    // search user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // if email is registered throw error
    if (user) throw new ConflictException('Email already registered!');

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...safeUser } = createdUser;

    return safeUser;
  }
}
