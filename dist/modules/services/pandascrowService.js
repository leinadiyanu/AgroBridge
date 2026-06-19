import axios from "axios";
import { AppError } from "../../shared/middleware/index.js";
const PANDASCROW_BASE_URL = "https://api.pandascrow.com/v3"; // confirm exact base URL when you get docs
const PANDASCROW_SECRET = process.env.PANDASCROW_SECRET_KEY;
const pandascrowClient = axios.create({
    baseURL: PANDASCROW_BASE_URL,
    headers: {
        Authorization: `Bearer ${PANDASCROW_SECRET}`,
        "Content-Type": "application/json",
    },
});
export const createEscrow = async (input) => {
    try {
        const { data } = await pandascrowClient.post("/escrows", input);
        return data;
    }
    catch (err) {
        throw new AppError("Failed to create escrow hold", 503);
    }
};
export const releaseEscrow = async (escrowId) => {
    try {
        const { data } = await pandascrowClient.post(`/escrows/${escrowId}/release`);
        return data;
    }
    catch (err) {
        throw new AppError("Failed to release escrow funds", 503);
    }
};
export const disputeEscrow = async (escrowId, reason) => {
    try {
        const { data } = await pandascrowClient.post(`/escrows/${escrowId}/dispute`, { reason });
        return data;
    }
    catch (err) {
        throw new AppError("Failed to raise dispute", 503);
    }
};
//# sourceMappingURL=pandascrowService.js.map