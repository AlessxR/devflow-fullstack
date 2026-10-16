import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { AssignTaskDto } from './dto/assign-task.dto.js';
import { FilterTaskDto } from './dto/filter-task.dto.js';

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

  async findAll(projectId: number, userId: number, filters: FilterTaskDto) {
    await this.assertProjectMember(projectId, userId);

    return await this.prisma.task.findMany({
      where: {
        projectId,
        ...(filters.status && { status: filters.status }),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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

  async assign(
    projectId: number,
    taskId: number,
    userId: number,
    dto: AssignTaskDto,
  ) {
    await this.assertProjectMember(projectId, userId);
    await this.findOne(projectId, taskId, userId);
    if (dto.assigneeId !== null) {
      const assigneeMember = await this.prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: dto.assigneeId,
            projectId,
          },
        },
      });

      if (!assigneeMember) {
        throw new BadRequestException(
          'Assignee must be a member of the project.',
        );
      }
    }

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        assigneeId: dto.assigneeId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
