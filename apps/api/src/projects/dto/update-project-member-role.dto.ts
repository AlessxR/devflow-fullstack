import { IsIn } from 'class-validator';
import { ProjectRole } from '../../generated/prisma/enums.js';

export class UpdateProjectMemberRoleDto {
  @IsIn([ProjectRole.MEMBER, ProjectRole.ADMIN])
  role: ProjectRole;
}
