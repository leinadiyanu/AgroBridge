import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UssdRepository {
    
  async saveTempUser(data: {
    phoneNumber: string;
    name: string;
    location: string;
  }) {
    return prisma.tempUser.create({
      data,
    });
  }

  async getTempUser(phoneNumber: string) {
    return prisma.tempUser.findUnique({
      where: { phoneNumber },
    });
  }

  async createUser(data: {
    phoneNumber: string;
    name: string;
    location: string;
    role: string;
  }) {
    return prisma.user.create({
      data,
    });
  }

  async createBuyRequest(data: {
    phoneNumber: string;
    crop: string;
    sessionId: string;
  }) {
    return prisma.ussdRequest.create({
      data: {
        phoneNumber: data.phoneNumber,
        crop: data.crop,
        type: "BUY",
        sessionId: data.sessionId,
      },
    });
  }

  async createSellRequest(data: {
    phoneNumber: string;
    crop: string;
    sessionId: string;
  }) {
    return prisma.ussdRequest.create({
      data: {
        phoneNumber: data.phoneNumber,
        crop: data.crop,
        type: "SELL",
        sessionId: data.sessionId,
      },
    });
  }
}
