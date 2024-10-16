import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class IdDto {
    @Min(1)
    @IsNumber()
    @IsNotEmpty()
    id: number;
}
