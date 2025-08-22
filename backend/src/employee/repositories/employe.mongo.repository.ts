import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IEmployeeRepository } from '../contracts/employee.repository.interface';
import { EmployeeEntity } from '../entities/employee.entity';
import { EmployeeStatus } from '../enum/employee-status.enum';

@Injectable()
export class EmployeeRepository implements IEmployeeRepository {
  constructor(
    @InjectModel(EmployeeEntity.name)
    private readonly model: Model<EmployeeEntity>,
  ) {}
  async updateStatus(
    id: string,
    status: EmployeeStatus,
  ): Promise<EmployeeEntity | null> {
    const updatedEmployee = await this.model
      .findOneAndUpdate({ _id: id }, { status }, { new: true })
      .exec();
    return updatedEmployee;
  }

  async findByCPF(cpf: string, idUser: string): Promise<EmployeeEntity | null> {
    await this.model.find().exec();
    const employee = await this.model.findOne({ cpf, idUser }).exec();
    return employee;
  }

  async create(
    user: Partial<EmployeeEntity>,
    idUser: string,
  ): Promise<EmployeeEntity> {
    const createdEmployee = new this.model({ ...user, idUser });
    return createdEmployee.save();
  }

  async findByUserAndFilters(
    idUser: string,
    filters: {
      name?: string;
      role?: string;
      status?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<EmployeeEntity[]> {
    const query: any = { idUser };

    if (filters.name) query.name = { $regex: filters.name, $options: 'i' };

    if (filters.role) query.role = filters.role;

    if (filters.status) query.status = filters.status;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    return this.model.find(query).skip(skip).limit(limit).exec();
  }
}
