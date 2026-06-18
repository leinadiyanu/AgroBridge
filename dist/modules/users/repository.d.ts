export interface UpdateProfileInput {
    name?: string;
    location?: string;
    email?: string;
    farmSize?: string;
    deliveryAddress?: string;
    coverageArea?: string;
}
export declare class UserRepository {
    findById(id: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        phoneNumber: string;
        email: string | null;
        name: string;
        location: string;
        pin: string | null;
        passwordHash: string | null;
        farmSize: string | null;
        deliveryAddress: string | null;
        coverageArea: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        phoneNumber: string;
        email: string | null;
        name: string;
        location: string;
        pin: string | null;
        passwordHash: string | null;
        farmSize: string | null;
        deliveryAddress: string | null;
        coverageArea: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByPhone(phoneNumber: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        phoneNumber: string;
        email: string | null;
        name: string;
        location: string;
        pin: string | null;
        passwordHash: string | null;
        farmSize: string | null;
        deliveryAddress: string | null;
        coverageArea: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getMe(id: string): Promise<{
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
        managedFarmers: {
            id: string;
        }[];
        agentOf: {
            agent: {
                id: string;
                phoneNumber: string;
                name: string;
            };
        }[];
    } | null>;
    getPublicProfile(id: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        name: string;
        location: string;
    } | null>;
    updateProfile(id: string, data: UpdateProfileInput): Promise<{
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
    updatePassword(id: string, passwordHash: string): Promise<{
        id: string;
    }>;
    updatePhone(id: string, phoneNumber: string): Promise<{
        id: string;
        phoneNumber: string;
    }>;
    listFarmers(page: number, limit: number): Promise<{
        farmers: {
            role: import("@prisma/client").$Enums.Role;
            id: string;
            name: string;
            location: string;
            farmSize: string | null;
            agentOf: {
                agent: {
                    id: string;
                    name: string;
                };
            }[];
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    listAgents(page: number, limit: number): Promise<{
        agents: {
            role: import("@prisma/client").$Enums.Role;
            id: string;
            name: string;
            location: string;
            coverageArea: string | null;
            managedFarmers: {
                id: string;
            }[];
        }[];
        total: number;
        page: number;
        limit: number;
    }>;
    savePendingPhoneChange(userId: string, newPhone: string): Promise<void>;
    getPendingPhoneChange(userId: string): Promise<string | null>;
    clearPendingPhoneChange(userId: string): Promise<void>;
}
//# sourceMappingURL=repository.d.ts.map