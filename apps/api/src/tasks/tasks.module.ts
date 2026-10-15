import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller.js';
import { TasksService } from './tasks.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [PrismaModule, AuthModule],
})
export class TasksModule {}
