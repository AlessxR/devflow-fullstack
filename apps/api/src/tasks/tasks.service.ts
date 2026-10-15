import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async assertProjectMember(projectId: number, userId: number) {
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
  }

  async create(projectId: number, dto: CreateTaskDto, userId: number) {
    await this.assertProjectMember(projectId, userId);

    return await this.prisma.task.create({
      data: {
        projectId,
        title: dto.title,
        description: dto.description,
        status: 'TODO',
      },
    });
  }

  async findAll(projectId: number, userId: number) {
    await this.assertProjectMember(projectId, userId);

    return await this.prisma.task.findMany({
      where: {
        projectId,
      },
    });
  }
}
