import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from "class-validator";
import { TaskStatus } from "../../generated/prisma/enums.js";

export class FilterTaskDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    assigneeId: number;
}