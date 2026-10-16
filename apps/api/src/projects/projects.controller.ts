import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard.js';

import type { AuthenticatedRequest } from '../auth/guards/jwt-auth/jwt-auth.guard.js';
import { ProjectsService } from './projects.service.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { AddProjectMemberDto } from './dto/add-project-member.dto.js';
import { UpdateProjectMemberRoleDto } from './dto/update-project-member-role.dto.js';

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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;
    return this.projects.update(projectId, userId, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) projectId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projects.remove(projectId, request.user.sub);
  }

  @Get(':id/members')
  @UseGuards(JwtAuthGuard)
  async getMembers(
    @Param('id', ParseIntPipe) projectId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projects.findMembers(projectId, request.user.sub);
  }

  @Post(':id/members')
  @UseGuards(JwtAuthGuard)
  addMember(
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: AddProjectMemberDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projects.addMember(projectId, request.user.sub, dto);
  }

  @Delete(':id/members/:memberId')
  @UseGuards(JwtAuthGuard)
  deleteMember(
    @Param('id', ParseIntPipe) projectId: number,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projects.removeMember(projectId, memberId, request.user.sub);
  }

  @Patch(':id/members/:memberId/role')
  @UseGuards(JwtAuthGuard)
  updateMemberRole(
    @Param('id', ParseIntPipe) projectId: number,
    @Req() request: AuthenticatedRequest,
    @Param('memberId', ParseIntPipe) memberId: number,
    @Body() dto: UpdateProjectMemberRoleDto,
  ) {
    return this.projects.updateMemberRole(
      projectId,
      request.user.sub,
      memberId,
      dto,
    );
  }
}
