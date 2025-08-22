import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeResponseDto } from '../dtos/employee-response.dto';
import { EmployeeStatus } from '../enum/employee-status.enum';

export interface IEmployeeService {
  createEmployee(
    dto: CreateEmployeeDto,
    idUser: string,
  ): Promise<EmployeeResponseDto>;
  updateEmployeeStatus(
    id: string,
    status: EmployeeStatus,
  ): Promise<EmployeeResponseDto | null>;
  getEmployees(
    idUser: string,
    filters: {
      name?: string;
      role?: string;
      status?: EmployeeStatus;
      page?: number;
      limit?: number;
    },
  ): Promise<EmployeeResponseDto[]>;
}
