import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { UpdateDoctorInfoDto } from 'src/doctors/dtos/update-doctors.dto';
import { IResponseMessage } from 'src/interfaces/responseMessage';
import { Repository } from 'typeorm';
import { CreateSpecialtyDto } from '../dtos/create-specialty.dto';
import { Speciality } from '../entities/specialties.entity';

@Injectable()
export class SpecialtiesService {
  constructor(
    @InjectRepository(Speciality)
    private readonly specialtyRepository: Repository<Speciality>,
  ) {}

  public async create(body: CreateSpecialtyDto): Promise<Speciality> {
    return this.specialtyRepository.save(body);
  }

  public async readAll(): Promise<Speciality[]> {
    return this.specialtyRepository.find();
  }

  public async update(
    id: number,
    { name }: UpdateDoctorInfoDto,
  ): Promise<Speciality | string> {
    await this.findSpecialtyById(id);

    await this.specialtyRepository.update({ id }, { name });

    return this.specialtyRepository.findOne({ where: { id } });
  }

  public async delete(id: number): Promise<IResponseMessage> {
    await this.findSpecialtyById(id);

    await this.specialtyRepository.delete(id);

    return {
      statusCode: 202,
      message: `the specialty with the id ${id} was deleted!`,
    };
  }

  public async findSpecialtyById(id: number): Promise<Speciality | AxiosError> {
    const hasSpecialtyById = await this.specialtyRepository.findOne({
      where: { id },
    });

    if (!hasSpecialtyById) {
      throw new NotFoundException(
        `we couldn't find a specialty with id: ${id}`,
      );
    }

    return hasSpecialtyById;
  }
}
