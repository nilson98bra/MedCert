import { Inject, Injectable } from '@nestjs/common';
import { ConflictError } from 'src/utils/errors/api-error.utils';
import type { IEmployeeRepository } from '../contracts/employee.repository.interface';
import { IEmployeeService } from '../contracts/employee.service.interface';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeResponseDto } from '../dtos/employee-response.dto';
import { EmployeeEntity } from '../entities/employee.entity';
import { EmployeeStatus } from '../enum/employee-status.enum';
import { cpf } from 'cpf-cnpj-validator';

@Injectable()
export class EmployeeService implements IEmployeeService {
  constructor(
    @Inject('IEmployeeRepository')
    private readonly repository: IEmployeeRepository,
  ) {}

  async updateEmployeeStatus(
    id: string,
    status: EmployeeStatus,
  ): Promise<EmployeeResponseDto | null> {
    const updatedEmployee = await this.repository.updateStatus(id, status);
    return updatedEmployee ? this.mapToResponse(updatedEmployee) : null;
  }

  async getEmployees(
    idUser: string,
    filters: {
      name?: string;
      role?: string;
      status?: EmployeeStatus;
      page?: number;
      limit?: number;
    },
  ): Promise<EmployeeResponseDto[]> {
    const employees = await this.repository.findByUserAndFilters(
      idUser,
      filters,
    );

    return employees.map(this.mapToResponse);
  }

  async createEmployee(
    dto: CreateEmployeeDto,
    idUser: string,
  ): Promise<EmployeeResponseDto> {
    const existingEmployee = await this.repository.findByCPF(dto.cpf, idUser);
    if (existingEmployee)
      throw new ConflictError('Employee with this CPF already exists');
    if (!cpf.isValid(dto.cpf)) throw new ConflictError('Invalid CPF');

    const employee = await this.repository.create(dto, idUser);
    return this.mapToResponse(employee);
  }

  private mapToResponse(user: EmployeeEntity): EmployeeResponseDto {
    return {
      id: user._id.toString(),
      name: user.name,
      cpf: user.cpf,
      birthdayDate: user.birthdayDate,
      role: user.role,
      status: user.status,
    };
  }
}
