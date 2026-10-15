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
import { CreateProjectDto } from './dto/create-project.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';

import type { AuthenticatedRequest } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { ProjectsService } from './projects.service.js';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;
    return this.projects.create(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async get(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;
    return this.projects.findAll(userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(
    @Param('id', ParseIntPipe) projectId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;
    return this.projects.findOne(projectId, userId);
  }
}
