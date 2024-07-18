import { PrismaClient } from '@prisma/client';
import pool from './db';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export default prisma;
