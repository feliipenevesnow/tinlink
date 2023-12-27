import { PrismaClient } from '@prisma/client';

let prisma = new PrismaClient();

if (process.env.NODE_ENV === 'production') {
  // Configuração para ambiente de produção
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_PROD, // Usar a URL do banco de dados de produção
       },
    },
  });
} 

export { prisma };
