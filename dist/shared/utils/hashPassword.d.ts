/**
 * Hashes a plain text password using bcrypt.
 *
 * Purpose:
 * - Protect user passwords before storing in database
 * - Prevent storing plain text passwords (security risk)
 *
 * Salt rounds = 10 (balanced security + performance)
 */
export declare const hashPassword: (password: string) => Promise<string>;
//# sourceMappingURL=hashPassword.d.ts.map