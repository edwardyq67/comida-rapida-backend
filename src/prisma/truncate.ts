// src/prisma/truncate.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Limpiando tablas relacionadas con los seeders...');

  const tables = [
    'pedido_adicionales',
    'pedido_ingredientes',
    'pedido_items',
    'pedidos',
    'estado_pedidos',
    'producto_ingredientes',
    'producto_opciones',
    'producto_tamanos',
    'Producto',
    'tamanos',
    'opciones',
    'ingredientes',
    'adicionales',
    'categorias',
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${table}" RESTART IDENTITY CASCADE;`,
      );
      console.log(`✔️  Tabla ${table} limpiada`);
    } catch (error) {
      console.error(`❌ Error al truncar ${table}:`, error);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
