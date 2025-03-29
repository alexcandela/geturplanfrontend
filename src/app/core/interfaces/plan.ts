export interface Plan {
  id: number;
  name: string;
  description: string;
  city: string;
  province: string;
  country: string;
  likes_count: number;
  has_liked: Boolean;
  img: string,
  user_id: number;
  user: UserPlan;
  latitude: number;
  longitude: number;
  created_at: string;
  categories: Category[];
  comments?: Comment[];
  principal_image: string;
  secondary_images?: Images[];
}

export interface Images {
  id: number;
  img: string;
  plan_id: number;
  created_at?: string;
  updated_at?: string;
}


export interface PlanResponse {
  status: string;
  plan: Plan;
}

export interface Comment {
  id: number
  comment: string;
  user_id: number;
  plan_id: number;
  user: UserPlan;
  likes_count: number;
  has_liked: boolean;
  has_replies: boolean;
  replies: CommentReply[]
  created_at: string;
}

export interface CommentReply {
  id: number
  reply: string;
  user_id: number;
  comment_id: number;
  user: UserPlan;
  likes_count: number;
  has_liked: boolean;
  created_at: string;
}

export interface UserPlan {
  id: number;
  name: string;
  last_name: string;
  username: string;
  img: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface PopularPlansResponse {
  status: string;
  plans: Array<Plan>;
}
export interface AllPlansResponse {
  status: string;
  plans: {
    data: Plan[];
    total: number;
  };
}
