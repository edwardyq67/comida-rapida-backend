// src/prisma/seeder-pedido.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPedido(): Promise<void> {
  // Limpiar tablas relacionadas
  await prisma.pedidoAdicional.deleteMany();
  await prisma.pedidoIngrediente.deleteMany();
  await prisma.pedidoItem.deleteMany();
  await prisma.pedido.deleteMany();

  // IDs de productos que vamos a usar
  const requiredProductIds = [1, 2, 3, 4];

  // Verificar que los productos existan
  const productos = await prisma.producto.findMany({
    where: { id: { in: requiredProductIds } },
  });

  const productosExistentes = productos.map((p) => p.id);
  const faltantes = requiredProductIds.filter(
    (id) => !productosExistentes.includes(id),
  );

  if (faltantes.length > 0) {
    throw new Error(
      `❌ Los siguientes productos no existen en la base de datos: ${faltantes.join(', ')}`,
    );
  }

  // Estados de pedido
  const pendiente = await prisma.estadoPedido.findUnique({ where: { id: 1 } });
  const enProceso = await prisma.estadoPedido.findUnique({ where: { id: 2 } });

  if (!pendiente || !enProceso) {
    throw new Error('❌ Debes correr primero el seeder de estadoPedido');
  }

  // Pedido 1: Pan con Chicharrón + Café
  await prisma.pedido.create({
    data: {
      cliente: 'Juan Pérez',
      estado_id: pendiente.id,
      total: 17.5,
      pedidoItems: {
        create: [
          {
            producto_id: 1, // Pan con Chicharrón
            cantidad: 1,
            precio_unitario: 12.5,
            subtotal: 12.5,
            pedidoIngredientes: {
              create: [
                { ingrediente_id: 1, incluido: true }, // Camote
                { ingrediente_id: 2, incluido: false }, // Cebolla
                { ingrediente_id: 3, incluido: true }, // Salsa
              ],
            },
          },
          {
            producto_id: 3, // Café
            cantidad: 1,
            precio_unitario: 5.0,
            subtotal: 5.0,
            pedidoIngredientes: {
              create: [
                { ingrediente_id: 6, incluido: true }, // Azúcar
                { ingrediente_id: 7, incluido: false }, // Stevia
                { ingrediente_id: 8, incluido: false }, // Leche
              ],
            },
          },
        ],
      },
    },
  });

  // Pedido 2: Pan con Hot Dog + Jugo de Fresa
  await prisma.pedido.create({
    data: {
      cliente: 'María López',
      estado_id: enProceso.id,
      total: 15.5,
      pedidoItems: {
        create: [
          {
            producto_id: 2, // Pan con Hot Dog
            cantidad: 1,
            precio_unitario: 8.0,
            subtotal: 8.0,
            pedidoIngredientes: {
              create: [
                { ingrediente_id: 4, incluido: true },
                { ingrediente_id: 5, incluido: true },
              ],
            },
          },
          {
            producto_id: 4, // Jugo de Fresa
            cantidad: 1,
            precio_unitario: 7.5,
            subtotal: 7.5,
            pedidoIngredientes: {
              create: [
                { ingrediente_id: 6, incluido: true },
                { ingrediente_id: 7, incluido: false },
                { ingrediente_id: 8, incluido: false },
              ],
            },
          },
        ],
      },
    },
  });

  console.log('✅ Pedidos insertados correctamente con IDs del 1 al 4');
}

seedPedido().catch((e) => {
  console.error(e);
  process.exit(1);
});
