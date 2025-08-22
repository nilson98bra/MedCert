import { MedCertificateResponseDto } from './med-certificate-response.dto';

export interface MedCertificatePaginationResponseDto {
  data: MedCertificateResponseDto[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
