import bcrypt from "bcrypt";
/**
 * Hashes a plain text password using bcrypt.
 *
 * Purpose:
 * - Protect user passwords before storing in database
 * - Prevent storing plain text passwords (security risk)
 *
 * Salt rounds = 10 (balanced security + performance)
 */
export const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};
//# sourceMappingURL=hashPassword.js.map