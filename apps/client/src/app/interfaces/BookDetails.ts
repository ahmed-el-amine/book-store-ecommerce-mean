interface Author {
  firstName: string;
  lastName: string;
  id: string;
}

export interface Book {
  id?: string; 
  title: string;
  isbn13: string;
  description: string;
  price: number;
  rating: number;
  publish_date: string;
  stock: number;
  coverImage: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string; 
  };
  weight: {
    value: number;
    unit: string; 
  };
  authors:  Author[];
  categories: string[];
}
