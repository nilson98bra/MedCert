import api from "./api";

interface UserDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export const cadUser = async (values: UserDto) => {
  const response = await api.post("/users", values);
  return response.data;
};
