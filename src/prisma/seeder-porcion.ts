import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedOpciones(): Promise<void> {
  // Limpiar tabla
  await prisma.opciones.deleteMany();

  // Insertar opciones con IDs fijos
  await prisma.opciones.createMany({
    data: [
      { id: 1, nombre: 'Panceta' },
      { id: 2, nombre: 'Carne' },
      { id: 3, nombre: 'Combinado' },
      { id: 4, nombre: 'Sin helar' },
      { id: 5, nombre: 'Helada' },
    ],
  });

  console.log('✅ Opciones insertadas con IDs');

  // Cerrar conexión
  await prisma.$disconnect();
}

// Ejecutar con manejo de errores
seedOpciones().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
