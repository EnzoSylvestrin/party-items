import prisma from "@/lib/prisma";
import { z } from "zod";

import bcrypt from 'bcryptjs';

const loginSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório!"),
    password: z.string().min(1, "A senha é obrigatória!"),
});

export async function Login(body: { name: string, password: string }) {
    const validatedData = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { name: validatedData.name },
    });

    if (user && await bcrypt.compare(validatedData.password, user.password)) {
      return { success: true, user };
    } else {
      return { success: false, message: 'Invalid credentials' };
    }
}