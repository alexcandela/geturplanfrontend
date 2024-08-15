import { Plan } from "./plan";

export interface User {
  username: string;
  email: string;
  description: string;
  img: string | null;
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}

export interface UserData {
  id: number;
  username: string;
}
export interface UserResponse {
    status: string;
    sameuser: boolean;
    user: User; 
}

export interface UserPlansResponse {
  status: string;
  plans: {
    data: Plan[];
    total: number;
  };
}


