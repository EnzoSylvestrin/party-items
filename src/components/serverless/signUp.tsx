'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';

const userSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório!"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "A cor precisa ser um hexadecimal válido"),
  password: z.string().min(3, "A senha precisa ter pelo menos 3 caracteres"),
  isAdmin: z.boolean().optional(),
});

export async function SignUp(body: { color: string, password: string, name: string, isAdmin?: boolean }) {
    const validatedData = userSchema.parse(body);
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const user = await prisma.user.create({
      data: { 
        ...validatedData,
        password: hashedPassword, 
      },
    });
    return user;
}