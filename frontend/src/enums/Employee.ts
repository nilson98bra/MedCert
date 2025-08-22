export default interface Employee {
  id: string;
  name: string;
  cpf: string;
  birthdayDate: Date;
  role: string;
  status: "active" | "inactive";
}
