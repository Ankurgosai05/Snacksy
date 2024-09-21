export type CheckoutSessionRequest = {
    cartItems:{
        menuId:string;
        name:string;
        image:string;
        price:string;
        quantity:string;
    }[];
    deliveryDetails:{
        name:string;
        email:string;
        contact:string;
        address:string;
        city:string;
        country:string
    },
    restaurantId:string;
}
export interface Orders extends CheckoutSessionRequest {
    _id:string;
    status:string;
    createdAt: string; // Add this line to include the date property
    totalAmount:number;
}
export type OrderState = {
    loading:boolean;
    orders:Orders[];
    createCheckoutSession: (checkoutSessionRequest:CheckoutSessionRequest) => Promise<void>;
    getOrderDetails: () => Promise<void>;
}