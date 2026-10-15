import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly projects: ProjectsService) {}

  create(dto: CreateProjectDto, userId: number) {
    
  }
}
