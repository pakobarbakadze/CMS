import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Company } from './entities/company.entity';

export default class CompanyRepository {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  create(company: Partial<Company>): Company {
    return this.companyRepository.create(company);
  }

  save(company: Company): Promise<Company> {
    return this.companyRepository.save(company);
  }

  findOne(conditions: FindOneOptions<Company>): Promise<Company> {
    return this.companyRepository.findOne(conditions);
  }

  find(conditions?: FindManyOptions<Company>): Promise<Company[]> {
    return this.companyRepository.find(conditions);
  }
}
