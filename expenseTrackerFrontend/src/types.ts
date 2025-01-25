export interface IUserDetails extends IUserCredentials {
  fullName: string;
  errors: { fullName?: string; email?: string; password?: string };
}

export interface IUserCredentials {
  email: string;
  password: string;
  errors: { email?: string; password?: string };
}

export interface ITransactionItem {
  id?: string;
  amount: number;
  category: ICategory;
  date: string;
  type: "income" | "expense";
  note?: string;
  createdUser?: IUser;
}

export interface ICategory {
  id: string;
  name: string;
  iconPath: string;
  type: string;
}

interface IUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface ISummary {
  allTime: number[];
  thisMonth: number[];
  year: number[];
}

export interface IBudget {
  id?: string;
  forMonth: string;
  limit: number;
  createdUser?: IUser;
}

export interface ToastItemProps {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  onClose: (id: string) => void;
}

export interface IToast {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
}