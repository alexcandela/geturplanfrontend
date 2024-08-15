export interface Category {
    id: number,
    name: string,
}

export interface CategoryResponse {
    status: string;
    categories: Category[];
  }