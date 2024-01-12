import { Company } from 'src/modules/company/entities/company.entity';

export class CreateUserDto {
  username: string;
  hashedPassword: string;
  company: Company;
}
