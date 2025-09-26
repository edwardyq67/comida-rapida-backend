import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedIngrediente(): Promise<void> {
  // Limpiar tabla
  await prisma.ingrediente.deleteMany();

  // Insertar ingredientes con IDs fijos
  await prisma.ingrediente.createMany({
    data: [
      { id: 1, nombre: 'Camote' },
      { id: 2, nombre: 'Cebolla' },
      { id: 3, nombre: 'Salsa Criolla' },
      { id: 4, nombre: 'Lechuga' },
      { id: 5, nombre: 'Papitas al hilo' },
      { id: 6, nombre: 'Azúcar' },
      { id: 7, nombre: 'Stevia' },
      { id: 8, nombre: 'Leche' },
      { id: 9, nombre: 'Hielo' },
      { id: 10, nombre: 'Limón' },
    ],
  });

  console.log('✅ Ingredientes insertados con IDs');

  // Cerrar conexión
  await prisma.$disconnect();
}

// Ejecutar con manejo de errores
seedIngrediente().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
