import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: number, dto: CreateTaskDto, userId: number) {
    const projectMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
    });

    if (!projectMember)
      throw new ForbiddenException('You are not a member of this project');

    return await this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        status: 'TODO',
      },
    });
  }
}
