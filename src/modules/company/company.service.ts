import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  create(createCompanyDto: CreateCompanyDto) {
    const { name } = createCompanyDto;

    const company = new Company();
    company.name = name;

    return this.companyRepository.save(company);
  }

  findAll() {
    return this.companyRepository.find();
  }

  findById(id: string) {
    return this.companyRepository.findOne({ where: { id } });
  }

  findByName(name: string) {
    return this.companyRepository.findOne({ where: { name } });
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: string) {
    return `This action removes a #${id} company`;
  }
}
