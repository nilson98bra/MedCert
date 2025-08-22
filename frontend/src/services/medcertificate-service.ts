import api from "./api";

interface CreateMedicalCertificateDto {
  idEmployee: string;
  employeeName: string;
  daysAway: number;
  medicalCertificateDate: string;
  cid: string;
  description: string;
  observation?: string;
}

interface GetMedicalCertificateParams {
  employeeName?: string;
  cid?: string;
  dateTimeInit?: string;
  dateTimeEnd?: string;
  page: number;
  limit: number;
}

export const getCIDs = async (query: string) => {
  const response = await api.get(`/medical-certificates/cids?query=${query}`);
  return response.data;
};

export const createMedicalCertificates = async (
  medicalCertificateValues: CreateMedicalCertificateDto,
) => {
  const response = await api.post(
    "/medical-certificates",
    medicalCertificateValues,
  );
  return response.data;
};

export const getMedicalCertificates = async (
  params?: GetMedicalCertificateParams,
) => {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  const response = await api.get(
    `/medical-certificates?${queryParams.toString()}`,
  );
  return response.data;
};
