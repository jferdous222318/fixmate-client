export type Role = "customer" | "technician" | "admin";

export type BookingStatus = "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";

export interface Service {
    _id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    basePrice: number;
    estimatedDuration: string;
    serviceMode: string;
    serviceArea: string;
    technicianName: string;
    technicianEmail: string;
    approvalStatus: "pending" | "approved" | "rejected";
    isAvailable: boolean;
    createdAt: string;
}

export interface ServiceDetails extends Service {
    technician: { name: string; image?: string; area?: string; bio?: string } | null;
}

export interface ServicesPage {
    services: Service[];
    total: number;
    page: number;
    pages: number;
}

export interface Booking {
    _id: string;
    serviceId: string;
    serviceTitle: string;
    serviceImage: string;
    category: string;
    basePrice: number;
    technicianName: string;
    technicianEmail: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    preferredDate: string;
    problemDescription: string;
    status: BookingStatus;
    finalAmount: number;
    paymentStatus: "unpaid" | "paid";
    statusHistory?: { status: string; changedAt: string }[];
    paidAt?: string;
    createdAt: string;
}

export interface Payment {
    _id: string;
    bookingId: string;
    serviceTitle: string;
    customerName: string;
    customerEmail: string;
    technicianName: string;
    technicianEmail: string;
    amount: number;
    currency: string;
    transactionId: string;
    stripeSessionId: string;
    paidAt: string;
}

export interface AppUser {
    _id: string;
    name: string;
    email: string;
    image?: string;
    role: Role;
    createdAt?: string;
}

export type StatusCounts = Record<BookingStatus, number>;
export type MonthlyPoint = { month: string; total: number };