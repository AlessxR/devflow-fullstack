import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

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

  async findOne(projectId: number, taskId: number, userId: number) {
    await this.assertProjectMember(projectId, userId);

    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        projectId,
      },
    });

    if (!task) throw new NotFoundException('Task not found.');

    return task;
  }

  async update(
    projectId: number,
    taskId: number,
    dto: UpdateTaskDto,
    userId: number,
  ) {
    await this.findOne(projectId, taskId, userId);

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
      },
    });
  }

  async remove(projectId: number, taskId: number, userId: number) {
    await this.findOne(projectId, taskId, userId);

    return this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  }
}
