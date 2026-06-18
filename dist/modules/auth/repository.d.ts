import { Role } from "@prisma/client";
export interface CreateUserInput {
    phoneNumber: string;
    email?: string;
    name: string;
    location: string;
    role: Role;
    passwordHash: string;
}
export declare class AuthRepository {
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
    findById(id: string): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        phoneNumber: string;
        email: string | null;
        name: string;
        location: string;
        createdAt: Date;
    } | null>;
    createUser(data: CreateUserInput): Promise<{
        role: import("@prisma/client").$Enums.Role;
        id: string;
        phoneNumber: string;
        email: string | null;
        name: string;
        location: string;
        createdAt: Date;
    }>;
    deleteUser(id: string): Promise<{
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
    }>;
    savePendingRegistration(phoneNumber: string, data: CreateUserInput): Promise<void>;
    getPendingRegistration(phoneNumber: string): Promise<CreateUserInput | null>;
    clearPendingRegistration(phoneNumber: string): Promise<void>;
    createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date;
    }>;
    findRefreshToken(token: string): Promise<{
        userId: string;
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date;
    } | null>;
    deleteRefreshToken(token: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    rotateRefreshToken(oldToken: string, userId: string, newToken: string, expiresAt: Date): Promise<[import("@prisma/client").Prisma.BatchPayload, {
        userId: string;
        id: string;
        createdAt: Date;
        token: string;
        expiresAt: Date;
    }]>;
}
//# sourceMappingURL=repository.d.ts.map