import { EmployeeEntity } from '../entities/employee.entity';
import { EmployeeStatus } from '../enum/employee-status.enum';

export interface IEmployeeRepository {
  create(
    user: Partial<EmployeeEntity>,
    idUser: string,
  ): Promise<EmployeeEntity>;
  findByCPF(cpf: string, idUser: string): Promise<EmployeeEntity | null>;
  updateStatus(
    id: string,
    status: EmployeeStatus,
  ): Promise<EmployeeEntity | null>;
  findByUserAndFilters(
    idUser: string,
    filters: {
      name?: string;
      role?: string;
      status?: EmployeeStatus;
      page?: number;
      limit?: number;
    },
  ): Promise<EmployeeEntity[]>;
}
