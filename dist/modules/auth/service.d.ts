import { Role } from "@prisma/client";
interface RegisterInitiateInput {
    phoneNumber: string;
    email: string;
    name: string;
    location: string;
    role: Role;
    password: string;
}
interface RegisterVerifyInput {
    phoneNumber: string;
    email: string;
    phoneOtp: string;
    emailOtp: string;
}
interface LoginInitiateInput {
    phoneNumber: string;
    password: string;
}
interface LoginVerifyInput {
    phoneNumber: string;
    otp: string;
}
export declare class AuthService {
    private repo;
    registerInitiate(input: RegisterInitiateInput): Promise<{
        message: string;
        channels: string[];
    }>;
    registerVerify(input: RegisterVerifyInput): Promise<{
        user: {
            role: import("@prisma/client").$Enums.Role;
            id: string;
            phoneNumber: string;
            email: string | null;
            name: string;
            location: string;
            createdAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    loginInitiate(input: LoginInitiateInput): Promise<{
        message: string;
    }>;
    loginVerify(input: LoginVerifyInput): Promise<{
        user: {
            role: import("@prisma/client").$Enums.Role;
            id: string;
            phoneNumber: string;
            email: string | null;
            name: string;
            location: string;
            farmSize: string | null;
            deliveryAddress: string | null;
            coverageArea: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(token: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(token: string): Promise<void>;
    getMe(userId: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        phoneNumber: string;
        email: string | null;
        name: string;
        location: string;
        createdAt: Date;
    }>;
}
export {};
//# sourceMappingURL=service.d.ts.map