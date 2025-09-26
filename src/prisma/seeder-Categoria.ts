import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedCategoria(): Promise<void> {
  // Limpiar tabla
  await prisma.categoria.deleteMany();

  // Insertar categorías
  await prisma.categoria.createMany({
    data: [
      { id: 1, nombre: 'Pan', imagen: 'pan.jpg' },
      { id: 2, nombre: 'Bebidas', imagen: 'bebidas.jpg' },
      { id: 3, nombre: 'Jugos', imagen: 'jugos.jpg' },
      { id: 4, nombre: 'Porciones', imagen: 'porciones.jpg' },
    ],
  });

  console.log('✅ Categorías insertadas con IDs');

  // Cerrar conexión
  await prisma.$disconnect();
}

// Ejecutar la función con manejo de errores
seedCategoria().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
