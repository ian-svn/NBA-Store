# Tienda NBA (Next.js + Sanity + Mercado Pago)

E-commerce simple para aprender:
- Productos administrados desde **Sanity** (nombre, precio, descripción, imágenes y stock).
- Front en **Next.js** con catálogo, detalle de producto y carrito.
- Checkout en **Mercado Pago**.

## 1) Instalar y correr

```bash
npm install
npm run dev
```

Abrí `http://localhost:3000`.

## 2) Variables de entorno

Creá un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=tu_project_id
NEXT_PUBLIC_SANITY_DATASET=production
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Notas:
- `MERCADOPAGO_ACCESS_TOKEN` define **a qué cuenta le llega el dinero**.
- Si querés cobrar en tu alias/cvu `ianvilap`, ese token debe ser de esa misma cuenta de Mercado Pago.

## 3) Editar productos desde Sanity

1. Entrá a `http://localhost:3000/studio`.
2. Creá/editar documentos de tipo `Producto`.
3. Campos disponibles:
   - `Nombre`
   - `Slug`
   - `Precio`
   - `Descripción`
   - `Imágenes`
   - `En stock`

Todo lo que cambies ahí impacta en la tienda.

## 4) Flujo de compra

1. Cliente agrega productos al carrito.
2. Hace click en "Pagar con Mercado Pago".
3. Se crea una preferencia en `/api/checkout`.
4. Mercado Pago redirige a:
   - `/pago/exito`
   - `/pago/error`
   - `/pago/pendiente`

## Estructura simple (para aprender)

- `src/app/page.tsx`: home y catálogo.
- `src/app/producto/[slug]/page.tsx`: detalle de producto.
- `src/app/carrito/page.tsx`: carrito y checkout.
- `src/app/api/checkout/route.ts`: integración con Mercado Pago.
- `src/context/cart-context.tsx`: estado del carrito (persistido en localStorage).
- `sanity/schemaTypes/product.ts`: schema del producto en Sanity.
