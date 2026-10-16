import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';

import type { AuthenticatedRequest } from '../auth/guards/jwt-auth/jwt-auth.guard.js';

import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { AssignTaskDto } from './dto/assign-task.dto.js';
import { FilterTaskDto } from './dto/filter-task.dto.js';

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
    @Query() filters: FilterTaskDto,
  ) {
    return this.tasks.findAll(projectId, request.user.sub, filters);
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

  @Patch(':taskId')
  @UseGuards(JwtAuthGuard)
  updateTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasks.update(projectId, taskId, dto, request.user.sub);
  }

  @Delete(':taskId')
  @UseGuards(JwtAuthGuard)
  removeTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasks.remove(projectId, taskId, request.user.sub);
  }

  @Patch(':taskId/assignee')
  @UseGuards(JwtAuthGuard)
  assignTask(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('taskId', ParseIntPipe) taskId: number,
    @Req() request: AuthenticatedRequest,
    @Body() dto: AssignTaskDto,
  ) {
    return this.tasks.assign(projectId, taskId, request.user.sub, dto);
  }


}
