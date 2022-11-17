/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from '../dtos/create-doctors.dto';
import { UpdateDoctorInfoDto } from '../dtos/update-doctors.dto';
import { Doctor } from '../entities/doctors.entities';
//const axios = require('axios');
import { DoctorZipCodeProvider } from '../providers/doctors-zipcode-provider';

@Injectable()
export class DoctorService {
  constructor(
    private readonly doctorZipCodeProvider: DoctorZipCodeProvider,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  public async create(body: CreateDoctorDto): Promise<Doctor | string> {
    const { crm } = body;

    const { data } = await this.doctorZipCodeProvider.getZipCode(body.zipCode);

    const normalizeAddressData = {
      address: {
        street: data.logradouro,
        complement: data.complemento,
        district: data.bairro,
        city: data.localidade,
        state: data.uf,
      },
    };

    const isDoctorExists = await this.doctorRepository.findOne({
      where: { crm },
    });

    if (isDoctorExists) {
      throw new ConflictException('CRM já cadastrado');
    }

    const doctorCreated = this.doctorRepository.save(
      Object.assign(body, normalizeAddressData),
    );

    return doctorCreated;
  }

  public readAll(): Promise<Doctor[]> {
    return this.doctorRepository.find();
  }

  public readById(id: number): Promise<Doctor> {
    return this.doctorRepository.findOne({ where: { id } });
  }

  public async update(
    id: number,
    {
      name,
      landlinePhone,
      mobilePhone,
      zipCode,
      medicalSpecialty,
    }: UpdateDoctorInfoDto,
  ): Promise<Doctor | string> {
    const body = {
      name,
      landlinePhone,
      mobilePhone,
      zipCode,
      medicalSpecialty,
    };

    const person = await this.doctorRepository.findOne({ where: { id } });

    if (!person)
      throw new NotFoundException(`Não achamos um doutor com o id ${id}`);

    await this.doctorRepository.update({ id }, body);

    await this.doctorZipCodeProvider.getZipCode(zipCode);

    return this.doctorRepository.findOne({ where: { id } });
  }

  public async delete(id: number): Promise<string> {
    const person = await this.doctorRepository.findOne({ where: { id } });

    if (!person)
      throw new NotFoundException(`Não achamos um doutor com o id ${id}`);

    await this.doctorRepository.delete({ id });

    return `A pessoa com o id ${id} foi deletada com sucesso!!!`;
  }
}
