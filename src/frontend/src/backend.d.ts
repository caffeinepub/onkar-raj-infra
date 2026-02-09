import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Product {
    id: string;
    specifications: string;
    standards: string;
    name: string;
    available: boolean;
    diameterRange: string;
    photo?: ExternalBlob;
    price?: number;
}
export interface WhatsAppConfig {
    prefilledMessage?: string;
    phoneNumber: string;
}
export interface SiteSettings {
    googleMapEmbed: string;
    contactLocation: string;
    whatsappConfig?: WhatsAppConfig;
    contactEmail: string;
    companyName: string;
    pricingTable: Array<[string, number]>;
    certifications: string;
    contactPhone: string;
}
export interface Feedback {
    id: string;
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface Message {
    id: string;
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface Enquiry {
    id: string;
    customerName: string;
    pipeDiameter: string;
    orderType: OrderType;
    email: string;
    requirementsFile?: ExternalBlob;
    timestamp: bigint;
    quantity: bigint;
    phoneNumber: string;
}
export interface UserProfile {
    name: string;
}
export enum OrderType {
    placeOrder = "placeOrder",
    requestQuote = "requestQuote"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    /**
     * / Grant admin access if correct passkey (from authenticated II user)
     */
    authenticateAdmin(passkey: string): Promise<void>;
    getAllEnquiries(): Promise<Array<Enquiry>>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAllMessages(): Promise<Array<Message>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPriceForDiameter(diameter: string): Promise<number | null>;
    getProduct(id: string): Promise<Product>;
    getSiteSettings(): Promise<SiteSettings>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(message: Message): Promise<void>;
    submitEnquiry(enquiry: Enquiry): Promise<void>;
    submitFeedback(feedbackData: Feedback): Promise<void>;
    updateSiteSettings(settings: SiteSettings): Promise<void>;
}
