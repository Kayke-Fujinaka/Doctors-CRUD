import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSpecialityDto } from './dtos/create-speciality.dto';
import { UpdateSpecialityInfoDto } from './dtos/update-speciality.dto';
import { Speciality } from './entities/specialities.entity';
import { SpecialitiesService } from './services/specialities.service';

@Controller('specialities')
export class SpecialitiesController {
  constructor(private readonly SpecialitiesService: SpecialitiesService) {}

  @Post('/')
  public async create(@Body() body: CreateSpecialityDto): Promise<Speciality> {
    return this.SpecialitiesService.create(body);
  }

  @Get('/')
  public async readAll(): Promise<Speciality[]> {
    return this.SpecialitiesService.readAll();
  }

  @Patch(':id')
  public async update(
    @Param('id')
    id: string,
    @Body() { name }: UpdateSpecialityInfoDto,
  ): Promise<Speciality | string> {
    return this.SpecialitiesService.update(id, name);
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<string> {
    return this.SpecialitiesService.delete(id);
  }
}