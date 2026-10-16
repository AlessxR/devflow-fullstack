import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProjectRole } from '../generated/prisma/enums.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { AddProjectMemberDto } from './dto/add-project-member.dto.js';

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
      },
    });
  }

  async remove(projectId: number, userId: number) {
    await this.assertCanManageProject(projectId, userId);

    return await this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  }

  async findMembers(projectId: number, userId: number) {
    await this.findOne(projectId, userId);

    const users = await this.prisma.projectMember.findMany({
      where: {
        projectId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return users;
  }

  async addMember(projectId: number, userId: number, dto: AddProjectMemberDto) {
    await this.assertCanManageProject(projectId, userId);

    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    const isMember = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: user.id,
          projectId: projectId,
        },
      },
    });

    if (isMember) throw new ConflictException('User in this project.');

    return this.prisma.projectMember.create({
      data: {
        userId: user.id,
        projectId,
        role: ProjectRole.MEMBER,
      },
    });
  }

  async removeMember(projectId: number, userId: number, memberId: number) {
    await this.assertCanManageProject(projectId, userId);

    const member = await this.prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: memberId,
          projectId,
        },
      },
    });

    if (!member) throw new NotFoundException('Member not found.');

    if (member.role === ProjectRole.OWNER) throw new ForbiddenException();

    return this.prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: memberId,
          projectId,
        },
      },
    });
  }
}
