interface Author {
  firstName: string;
  lastName: string;
  _id?: string;
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
  publishedDate?: Date | string;
  isbn?: string;
  pageCount?: number;
  language?: string;
  publisher?: string;
}
