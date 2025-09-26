import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedTamano(): Promise<void> {
  // Limpiar tabla
  await prisma.tamano.deleteMany();

  // Insertar tamaños con IDs fijos
  await prisma.tamano.createMany({
    data: [
      { id: 1, nombre: 'Pequeño' },
      { id: 2, nombre: 'Mediano' },
      { id: 3, nombre: 'Grande' },
      { id: 4, nombre: '1/4 Kg' },
      { id: 5, nombre: '1/2 Kg' },
      { id: 6, nombre: '1 Kg' },
    ],
  });

  console.log('✅ Tamaños insertados con IDs');

  // Cerrar conexión
  await prisma.$disconnect();
}

// Ejecutar con manejo de errores
seedTamano().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
