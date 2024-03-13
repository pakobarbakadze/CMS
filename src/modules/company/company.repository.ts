import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export default class CompanyRepository {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  public create(company: Partial<Company>): Company {
    return this.companyRepository.create(company);
  }

  public save(company: Company): Promise<Company> {
    return this.companyRepository.save(company);
  }

  public findOne(conditions: FindOneOptions<Company>): Promise<Company> {
    return this.companyRepository.findOne(conditions);
  }

  public find(conditions?: FindManyOptions<Company>): Promise<Company[]> {
    return this.companyRepository.find(conditions);
  }
}
