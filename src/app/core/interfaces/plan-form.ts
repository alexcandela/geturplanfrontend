export interface PlanForm {
  name: string;
  description: string;
  province: string;
  city: string;
  url: string;
  categories: string[];
  principal_image: File;
  secondary_images: File[];
}

export interface PlanFormResponse {
  status: string;
  message: string;
  planId?: number;
}
