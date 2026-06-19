// utils/role.ts
import { Role } from "@prisma/client";
export function parseRole(input) {
    switch (input) {
        case "1": return Role.FARMER;
        case "2": return Role.BUYER;
        case "3": return Role.AGENT;
        default: return null;
    }
}
//# sourceMappingURL=parseRole.js.map