import { CreateMedCertificateDto } from '../dtos/create-med-certificate.dto';
import { MedCertificateResponseDto } from '../dtos/med-certificate-response.dto';
import { MedCertificatePaginationResponseDto } from '../dtos/paginateCertificate.dto';

export interface IMedCertificateService {
  createMedCertificate(
    dto: CreateMedCertificateDto,
    idUser: string,
  ): Promise<MedCertificateResponseDto>;
  getAllCids(
    search: string,
    idUser: string,
  ): Promise<{ cid: string; description: string }[]>;
  getMedCertificates(
    idUser: string,
    filters: {
      employeeName?: string;
      cid?: string;
      dateTimeInit?: string;
      dateTimeEnd?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<MedCertificatePaginationResponseDto>;
}
