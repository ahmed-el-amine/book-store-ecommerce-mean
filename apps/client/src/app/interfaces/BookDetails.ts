interface Author {
  firstName: string;
  lastName: string;
  id?: string;
}

interface Dimensions {
  width: number;
  height: number;
  depth: number;
  unit: string;
}

interface Weight {
  value: number;
  unit: string;
}

export interface Book {
  _id: string;
  title: string;
  coverImage: string;
  price: number; // Needed for cart functionality
  authors: Author[];
  // Other properties used elsewhere in your app
  rating: number; // Optional if you're using star ratings
  description?: string;
  categories?: string[];
  publish_date?: Date | string;
  isbn13?: string;
  stock:number;
  pageCount?: number;
  language?: string;
  publisher?: string;
  dimensions:Dimensions;
  weight:Weight;
}
