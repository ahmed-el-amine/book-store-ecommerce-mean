// review.model.ts
export interface ReviewOwnerData {
    username: string;  
    firstName: string;  
    lastName: string;  
    email: string;  
    role: string;  
}

export interface Review {
    id: string; 
    bookId: string;
    comment: string; 
    createdAt: string;  
    rating: number; 
    reviewOwnerData: ReviewOwnerData;  
}

export interface ReviewResponse {
    reviewList: Review[];  
}

