import { Inject, Injectable } from '@nestjs/common';
import { MedCertificateEntity } from '../entities/medcertificate.entity';
import { CreateMedCertificateDto } from '../dtos/create-med-certificate.dto';
import type { IMedCertificateRepository } from '../contracts/med-certificate.repository.interface';
import { IMedCertificateService } from '../contracts/med-certificate.service.interface';
import { MedCertificateResponseDto } from '../dtos/med-certificate-response.dto';
import type { ICidRepository } from '../contracts/cid.repository';
import { IcdService } from 'src/icd/icd.service';
import { UnauthorizedError } from 'src/utils/errors/api-error.utils';
import { MedCertificatePaginationResponseDto } from '../dtos/paginateCertificate.dto';

@Injectable()
export class MedCertificateService implements IMedCertificateService {
  constructor(
    @Inject('IMedCertificateRepository')
    private readonly repositoryCertificate: IMedCertificateRepository,
    @Inject('ICidRepository') private readonly repositoryCid: ICidRepository,
    private readonly icdService: IcdService,
  ) {}

  async getAllCids(
    search: string,
    idUser: string,
  ): Promise<{ cid: string; description: string }[]> {
    if (search) {
      try {
        const cidsFromApi = await this.icdService.search(search);
        if (cidsFromApi && cidsFromApi.length > 0) {
          return cidsFromApi;
        }
      } catch (error) {
        console.error('Error searching CIDs in the external API:', error);
      }
    }

    try {
      const cidsFromDb = await this.repositoryCid.findAllCids(idUser);

      const filteredCids = cidsFromDb.filter(
        (cid) =>
          !search || cid.cid.toLowerCase().includes(search.toLowerCase()),
      );

      return filteredCids.map((cid) => ({
        cid: cid.cid,
        description: cid.description,
      }));
    } catch (error) {
      console.error('Error searching CIDs in the database:', error);
      throw new UnauthorizedError('Failed to retrieve the list of CIDs.');
    }
  }

  async getMedCertificates(
    idUser: string,
    filters: {
      employeeName?: string | undefined;
      cid?: string | undefined;
      dateTimeInit?: string | undefined;
      dateTimeEnd?: string | undefined;
      page?: number | undefined;
      limit?: number | undefined;
    },
  ): Promise<MedCertificatePaginationResponseDto> {
    const paginatedResult =
      await this.repositoryCertificate.findByUserAndFilters(idUser, filters);

    const mappedData = paginatedResult.data.map(this.mapToResponse);

    return {
      data: mappedData,
      totalItems: paginatedResult.totalItems,
      totalPages: paginatedResult.totalPages,
      currentPage: paginatedResult.currentPage,
    };
  }

  async createMedCertificate(
    dto: CreateMedCertificateDto,
    idUser: string,
  ): Promise<MedCertificateResponseDto> {
    const createdMedCertificate = await this.repositoryCertificate.create(
      dto,
      idUser,
    );
    const cidEntity = await this.repositoryCid.findCidByCid(
      createdMedCertificate.cid,
      idUser,
    );
    if (!cidEntity)
      await this.repositoryCid.create(
        {
          cid: createdMedCertificate.cid,
          description: createdMedCertificate.description,
        },
        idUser,
      );

    return this.mapToResponse(createdMedCertificate);
  }

  private mapToResponse(
    medCertifi: MedCertificateEntity,
  ): MedCertificateResponseDto {
    return {
      id: medCertifi._id.toString(),
      idEmployee: medCertifi.idEmployee,
      employeeName: medCertifi.employeeName,
      daysAway: String(medCertifi.daysAway),
      medicalCertificateDate: medCertifi.medicalCertificateDate,
      idUser: medCertifi.idUser,
      cid: medCertifi.cid,
      description: medCertifi.description,
      observation: medCertifi.observation,
    };
  }
}
