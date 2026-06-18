import type { UpdateProfileInput } from "./repository.js";
interface ChangePasswordInput {
    oldPassword: string;
    newPassword: string;
}
export declare class UserService {
    private repo;
    getMe(userId: string): Promise<{
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
    } | {
        agent: {
            id: string;
            phoneNumber: string;
            name: string;
        } | null;
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
    } | {
        managedFarmersCount: number;
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
    }>;
    updateProfile(userId: string, data: UpdateProfileInput): Promise<{
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
    }>;
    changePassword(userId: string, data: ChangePasswordInput): Promise<void>;
    initiatePhoneChange(userId: string, newPhone: string): Promise<{
        message: string;
    }>;
    verifyPhoneChange(userId: string, otp: string): Promise<{
        phoneNumber: string;
    }>;
    getPublicProfile(targetId: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        name: string;
        location: string;
    }>;
    listFarmers(page: number, limit: number): Promise<{
        farmers: {
            agent: {
                id: string;
                name: string;
            } | null;
            role: import("@prisma/client").$Enums.Role;
            id: string;
            name: string;
            location: string;
            farmSize: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    listAgents(page: number, limit: number): Promise<{
        agents: {
            managedFarmersCount: number;
            role: import("@prisma/client").$Enums.Role;
            id: string;
            name: string;
            location: string;
            coverageArea: string | null;
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
}
export {};
//# sourceMappingURL=service.d.ts.map