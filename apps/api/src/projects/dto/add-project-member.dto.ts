import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AddProjectMemberDto {


    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email!: string;
}