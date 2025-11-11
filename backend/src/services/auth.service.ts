import bcrypt from 'bcryptjs';
import { prisma } from '../db/client.js';
import type { SignupInput, LoginInput } from '../schemas/auth.schema.js';

const SALT_ROUNDS = 10;

// Pure utility functions
const hashPassword = async (password: string): Promise<string> => 
  bcrypt.hash(password, SALT_ROUNDS);

const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> =>
  bcrypt.compare(password, hashedPassword);

const sanitizeUser = (user: any) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
});

// Pure service functions
const signup = async (data: SignupInput) => {
    const { email, password, name } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('EMAIL_EXISTS');
    }

  const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    return user;
};

const login = async (data: LoginInput) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('EMAIL_NOT_FOUND');
    }

  const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error('WRONG_PASSWORD');
    }

  return sanitizeUser(user);
    };

const getUserById = async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }

    return user;
};

// Export individual functions
export { signup, login, getUserById };

// Default export object for backward compatibility
const authService = {
  signup,
  login,
  getUserById,
};

export default authService;

