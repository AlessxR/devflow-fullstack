import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional } from "class-validator";
import { TaskStatus } from "../../generated/prisma/enums.js";

export class FilterTaskDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus

    @IsInt()
    @Type(() => Number)
    @IsOptional()
    assigneeId?: number;


    @IsOptional()
    @IsIn(['createdAt', 'title'])
    sortBy?: 'createdAt' | 'title'


    @IsOptional()
    @IsIn(['asc', 'desc'])
    order?: 'asc' | 'desc'
}