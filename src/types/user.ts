export interface User {
  _id?: string;
  id?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role?: "user" | "operator" | "admin";
  isBlocked?: boolean;
   isApproved?: boolean;
  phone?: string;
  gender?: "male" | "female";
  dob?: string;
  token: string;
}