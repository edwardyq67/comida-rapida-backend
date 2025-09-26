import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedOpciones(): Promise<void> {
  await prisma.opciones.deleteMany();

  await prisma.opciones.createMany({
    data: [
      { id: 1, nombre: 'Panceta' },
      { id: 2, nombre: 'Carne' },
      { id: 3, nombre: 'Combinado' },
      { id: 4, nombre: 'Sin helar' },
      { id: 5, nombre: 'Helada' },
    ],
  });

  console.log('✅ Opciones insertadas');
  await prisma.$disconnect();
}

seedOpciones().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
