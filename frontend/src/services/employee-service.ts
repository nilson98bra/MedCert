import Employee from "@/enums/Employee";
import api from "./api";

interface CreateEmployeeDto {
  name: string;
  cpf: string;
  role: string;
  birthdayDate: string;
  status: string;
}

interface GetEmployeesParams {
  name?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export const createEmployee = async (dto: CreateEmployeeDto) => {
  const response = await api.post("/employees", dto);
  return response.data;
};

export const getEmployees = async (
  params?: GetEmployeesParams,
): Promise<Employee[]> => {
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
  }

  const url = `/employees?${queryParams.toString()}`;

  const response = await api.get(url);
  return response.data;
};

export const changeEmployeeStatus = async (id: string, status: string) => {
  const response = await api.patch(`/employees/${id}/status`, { status });
  return response.data;
};
