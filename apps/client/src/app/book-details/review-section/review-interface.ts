// review.model.ts
export interface ReviewOwnerData {
    username: string;  // اسم المستخدم
    firstName: string;  // الاسم الأول
    lastName: string;  // الاسم الأخير
    email: string;  // البريد الإلكتروني
    role: string;  // الدور (مثل "مستخدم")
}

export interface Review {
    id: string;  // معرف المراجعة
    bookId: string;  // معرف الكتاب
    comment: string;  // تعليق المراجعة
    createdAt: string;  // تاريخ الإنشاء
    rating: number;  // تقييم المراجعة (رقم)
    reviewOwnerData: ReviewOwnerData;  // بيانات صاحب المراجعة
}

// هذا الـ interface يمثل بنية الـ API في حالة كانت المراجعات في مصفوفة
export interface ReviewResponse {
    reviewList: Review[];  // مصفوفة تحتوي على المراجعات
}

