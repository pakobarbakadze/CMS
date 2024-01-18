import { Injectable } from '@nestjs/common';
import { FindOneOptions } from 'typeorm';
import CompanyRepository from './company.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(private readonly companyRepository: CompanyRepository) {}

  public create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const { name } = createCompanyDto;

    const company = this.companyRepository.create({ name });

    return this.companyRepository.save(company);
  }

  public findOne(conditions: FindOneOptions): Promise<Company> {
    return this.companyRepository.findOne(conditions);
  }

  public findAll(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  public update(id: string, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  public remove(id: string) {
    return `This action removes a #${id} company`;
  }
}
