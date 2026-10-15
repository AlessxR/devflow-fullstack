import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProjectRole } from '../generated/prisma/enums.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProjectDto, userId: number) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        members: {
          create: {
            role: ProjectRole.OWNER,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.project.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findOne(projectId: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        members: {
          some: {
            userId,
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException();
    }

    return project;
  }

  private async assertCanManageProject(projectId: number, userId: number) {
    const projectMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          projectId,
          userId,
        },
      },
    });

    if (!projectMember) {
      throw new ForbiddenException();
    }

    if (
      projectMember.role !== ProjectRole.OWNER &&
      projectMember.role !== ProjectRole.ADMIN
    ) {
      throw new ForbiddenException();
    }

    return projectMember;
  }

  async update(projectId: number, userId: number, dto: UpdateProjectDto) {
    await this.assertCanManageProject(projectId, userId);

    return await this.prisma.project.update({
        data: {
            name: dto.name,
            description: dto.description,
        },
        where: {
            id: projectId,
        }
    });


  }
}
