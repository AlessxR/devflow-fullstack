import { IsEnum, IsOptional, IsString } from "class-validator";
import { TaskStatus } from "../../generated/prisma/enums.js";

export class FilterTaskDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status: TaskStatus


    
}