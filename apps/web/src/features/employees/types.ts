export type EmployeeStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "";

export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: EmployeeStatus;
};