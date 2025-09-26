// src/prisma/seeder-estadoPedido.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEstadoPedido() {
  console.log('🌱 Seeding estadoPedido...');

  const estadosPedido = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'Confirmado' },
    { id: 3, nombre: 'En preparación' },
    { id: 4, nombre: 'Listo' },
    { id: 5, nombre: 'Entregado' },
    { id: 6, nombre: 'Cancelado' },
  ];

  for (const estado of estadosPedido) {
    await prisma.estadoPedido.upsert({
      where: { id: estado.id },
      update: estado,
      create: estado,
    });
  }

  console.log('✅ EstadoPedido seeding completed');
}

// Manejo correcto de la promesa
async function main() {
  try {
    await seedEstadoPedido();
  } catch (error) {
    console.error('❌ Error seeding estadoPedido:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
