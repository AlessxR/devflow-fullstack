import { IsInt } from 'class-validator';

export class AssignTaskDto {
  @IsInt()
  assigneeId!: number;
}
