import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMedCertificateRepository } from '../contracts/med-certificate.repository.interface';
import { MedCertificateEntity } from '../entities/medcertificate.entity';

@Injectable()
export class MedCertificateRepository implements IMedCertificateRepository {
  constructor(
    @InjectModel(MedCertificateEntity.name)
    private readonly model: Model<MedCertificateEntity>,
  ) {}

  async create(
    medcertificate: Partial<MedCertificateEntity>,
    idUser: string,
  ): Promise<MedCertificateEntity> {
    const createdCedcertificate = new this.model({
      ...medcertificate,
      idUser: idUser,
    });
    return createdCedcertificate.save();
  }

  async findByUserAndFilters(
    idUser: string,
    filters: {
      employeeName?: string;
      cid?: string;
      dateTimeInit?: string;
      dateTimeEnd?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<{
    data: MedCertificateEntity[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }> {
    const query: any = { idUser };
    const { employeeName, cid, dateTimeInit, dateTimeEnd, page, limit } =
      filters;

    if (employeeName)
      query.employeeName = { $regex: employeeName, $options: 'i' };

    if (cid) query.cid = { $regex: cid, $options: 'i' };

    if (dateTimeInit || dateTimeEnd) {
      query.medicalCertificateDate = {};
      if (dateTimeInit)
        query.medicalCertificateDate.$gte = new Date(dateTimeInit);
      if (dateTimeEnd)
        query.medicalCertificateDate.$lte = new Date(dateTimeEnd);
    }

    const pageNumber = page || 1;
    const limitNumber = limit || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const totalItems = await this.model.countDocuments(query);

    const data = await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .exec();

    return {
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber),
      currentPage: pageNumber,
    };
  }
}
