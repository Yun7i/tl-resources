import { getPrismaClient } from '../utils/prismaClient';

export const createUser = async (data: {
  email: string;
  passwordHash: string;
  firstName?: string | null;
  lastName?: string | null;
}) => {
  const prisma = getPrismaClient();
  return prisma.user.create({ data });
};

export const findUserByEmail = async (email: string) => {
  const prisma = getPrismaClient();
  return prisma.user.findUnique({ where: { email } });
};
