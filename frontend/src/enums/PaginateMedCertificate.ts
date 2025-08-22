import MedCertificate from "./MedCertificate";

export interface MedCertificatePaginationResponseDto {
  data: MedCertificate[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
