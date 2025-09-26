import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedAdicional(): Promise<void> {
  await prisma.adicional.deleteMany();

  await prisma.adicional.createMany({
    data: [
      { id: 1, nombre: 'Extra Queso', precio: 2.5, imagen: 'queso.jpg' },
      { id: 2, nombre: 'Extra Salsa', precio: 1.0, imagen: 'salsa.jpg' },
      { id: 3, nombre: 'Papas Fritas', precio: 3.0, imagen: 'papas.jpg' },
    ],
  });

  console.log('✅ Adicionales insertados con IDs');

  await prisma.$disconnect();
}

// ✅ Forma correcta de ejecutar la promesa para que ESLint no marque error
seedAdicional().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
