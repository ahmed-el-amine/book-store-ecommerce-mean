export interface BookEssential{
  _id?:string;
  title:string;
  isbn13:string;
  description:string;
  price:number;
  rating:number;
  publish_date:Date;
  stock:number;
  coverImage:string;
}
