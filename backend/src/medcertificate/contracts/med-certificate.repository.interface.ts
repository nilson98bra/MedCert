import { MedCertificateEntity } from '../entities/medcertificate.entity';

export interface IMedCertificateRepository {
  create(
    medcertificate: Partial<MedCertificateEntity>,
    idUser: string,
  ): Promise<MedCertificateEntity>;
  findByUserAndFilters(
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
  }>;
}
