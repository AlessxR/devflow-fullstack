import { IsInt, IsOptional } from 'class-validator';

export class AssignTaskDto {
  @IsInt()
  @IsOptional()
  assigneeId!: number | null;

}
