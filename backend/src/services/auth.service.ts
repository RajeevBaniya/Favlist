import bcrypt from 'bcryptjs';
import { prisma } from '../db/client.js';
import type { SignupInput, LoginInput } from '../schemas/auth.schema.js';

const SALT_ROUNDS = 10;

export class AuthService {
  async signup(data: SignupInput) {
    const { email, password, name } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('EMAIL_EXISTS');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

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
  }

  async login(data: LoginInput) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('EMAIL_NOT_FOUND');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('WRONG_PASSWORD');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async getUserById(userId: string) {
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
  }
}

export const authService = new AuthService();

