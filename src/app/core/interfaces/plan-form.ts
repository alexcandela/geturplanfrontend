export interface PlanForm {
  name: string;
  description: string;
  province: string;
  city: string;
  coordinates: google.maps.LatLngLiteral; 
  categories: string[];
  principal_image: File;
  secondary_images: File[];
}

export interface PlanFormResponse {
  status: string;
  message: string;
  planId?: number;
}
