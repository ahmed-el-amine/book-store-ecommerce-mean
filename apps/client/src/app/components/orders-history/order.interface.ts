// order.model.ts

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderItem {
  bookId: string; 
  title: string;
  quantity: number;
  price: number; 
  coverImage?: string;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
export type PaymentMethod = 'Stripe' | 'Cash on Delivery';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface Order {
  id: string; 
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: Address;
  estimatedDeliveryDate: Date;
  notes?: string;
  discountApplied: number;
  taxAmount: number;

  subtotal?: number;
  totalPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}
