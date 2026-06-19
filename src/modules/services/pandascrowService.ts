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

interface CreateEscrowInput {
  amount: number;
  buyerEmail: string;
  sellerEmail: string;
  description: string;
  reference: string;
}

interface EscrowResponse {
  status: boolean;
  data: {
    escrow_id: string;
    status: string;
  };
}

export const createEscrow = async (input: CreateEscrowInput): Promise<EscrowResponse> => {
  try {
    const { data } = await pandascrowClient.post<EscrowResponse>("/escrows", input);
    return data;
  } catch (err) {
    throw new AppError("Failed to create escrow hold", 503);
  }
};

export const releaseEscrow = async (escrowId: string): Promise<EscrowResponse> => {
  try {
    const { data } = await pandascrowClient.post<EscrowResponse>(
      `/escrows/${escrowId}/release`,
    );
    return data;
  } catch (err) {
    throw new AppError("Failed to release escrow funds", 503);
  }
};

export const disputeEscrow = async (escrowId: string, reason: string): Promise<EscrowResponse> => {
  try {
    const { data } = await pandascrowClient.post<EscrowResponse>(
      `/escrows/${escrowId}/dispute`,
      { reason },
    );
    return data;
  } catch (err) {
    throw new AppError("Failed to raise dispute", 503);
  }
};