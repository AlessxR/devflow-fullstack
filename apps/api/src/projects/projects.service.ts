import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProjectRole } from '../generated/prisma/enums.js';

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
                    userId
                }
            }
        }
    })
  }
  
  async findOne(projectId: number, userId: number) {
    const project = await this.prisma.project.findFirst({
        where: {
            id: projectId,
            members: {
                some: {
                    userId
                }
            }
        }
    });

    if (!project) {
        throw new NotFoundException();
    }

    return project;
  }
}
