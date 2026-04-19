import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY, type Product } from "@/sanity/lib/queries";

type BodyItem = { _id: string; quantity: number };

export async function POST(req: Request) {
  if (!client) {
    return NextResponse.json(
      { error: "Sanity no está configurado (NEXT_PUBLIC_SANITY_PROJECT_ID)." },
      { status: 500 }
    );
  }

  const token = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Falta MERCADOPAGO_ACCESS_TOKEN en el servidor. Agregalo en .env.local, guardá el archivo y reiniciá npm run dev.",
      },
      { status: 500 }
    );
  }

  let body: { items?: BodyItem[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return NextResponse.json(
      { error: "Enviá al menos un ítem con _id y quantity." },
      { status: 400 }
    );
  }

  const cleaned: BodyItem[] = [];
  for (const line of rawItems) {
    if (
      typeof line._id !== "string" ||
      typeof line.quantity !== "number" ||
      !Number.isFinite(line.quantity) ||
      line.quantity < 1 ||
      !Number.isInteger(line.quantity)
    ) {
      return NextResponse.json(
        { error: "Cada ítem necesita _id (string) y quantity (entero ≥ 1)." },
        { status: 400 }
      );
    }
    cleaned.push({ _id: line._id, quantity: line.quantity });
  }

  const ids = [...new Set(cleaned.map((l) => l._id))];
  const products = await client.fetch<Product[]>(PRODUCTS_BY_IDS_QUERY, {
    ids,
  });

  if (products.length !== ids.length) {
    return NextResponse.json(
      { error: "Uno o más productos no existen." },
      { status: 400 }
    );
  }

  const byId = new Map(products.map((p) => [p._id, p]));
  const mpItems: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }> = [];

  for (const line of cleaned) {
    const product = byId.get(line._id);
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado." }, { status: 400 });
    }
    if (product.inStock === false) {
      return NextResponse.json(
        { error: `${product.title} no está disponible.` },
        { status: 400 }
      );
    }
    mpItems.push({
      id: product._id,
      title: product.title,
      quantity: line.quantity,
      unit_price: product.price,
      currency_id: "ARS",
    });
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(req.url).origin;

  const mp = new MercadoPagoConfig({ accessToken: token });
  const preference = new Preference(mp);

  try {
    const result = await preference.create({
      body: {
        items: mpItems,
        back_urls: {
          success: `${baseUrl}/pago/exito`,
          failure: `${baseUrl}/pago/error`,
          pending: `${baseUrl}/pago/pendiente`,
        },
        auto_return: "approved",
        statement_descriptor: "TIENDA NBA",
      },
    });

    const payUrl = result.init_point ?? result.sandbox_init_point;
    if (!payUrl) {
      return NextResponse.json(
        { error: "Mercado Pago no devolvió URL de pago." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: payUrl });
  } catch (err) {
    console.error("[checkout] Mercado Pago:", err);
    return NextResponse.json(
      {
        error:
          "Mercado Pago rechazó la operación. Revisá que MERCADOPAGO_ACCESS_TOKEN sea el Access Token de producción o prueba (panel de desarrolladores), sin comillas ni espacios extra, y que coincida con la cuenta que cobra.",
      },
      { status: 502 }
    );
  }
}
