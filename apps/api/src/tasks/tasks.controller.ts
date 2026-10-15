import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';

import type { AuthenticatedRequest } from '../auth/guards/jwt-auth/jwt-auth.guard.js';

import { CreateTaskDto } from './dto/create-task.dto.js';

@Controller('projects/:projectId/tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addTasks(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasks.create(projectId, dto, request.user.sub);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getTasks(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasks.findAll(projectId, request.user.sub);
  }

  @Get(':taskId')
  @UseGuards(JwtAuthGuard)
  getTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasks.findOne(projectId, taskId, request.user.sub);
  }
}
