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

  const token = process.env.MP_ACCESS_TOKEN?.trim();
  if (!token) {
    return NextResponse.json(
      {
        error:
          "Falta MP_ACCESS_TOKEN en el servidor. Asegurate de definirlo en .env.local sin comillas ni espacios extra, guardá el archivo y reiniciá npm run dev.",
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

  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = req.headers.get("host");
  const requestOrigin = (() => {
    try {
      return new URL(req.url).origin;
    } catch {
      if (host) {
        return `${forwardedProto ?? "http"}://${host}`;
      }
      return undefined;
    }
  })();

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    requestOrigin;

  if (!baseUrl) {
    return NextResponse.json(
      {
        error:
          "No se pudo determinar la URL base. Definí NEXT_PUBLIC_APP_URL en .env.local o asegurate de que el host esté disponible en la solicitud.",
      },
      { status: 500 }
    );
  }

  const successUrl = `${baseUrl}/pago/exito`;
  const failureUrl = `${baseUrl}/pago/error`;
  const pendingUrl = `${baseUrl}/pago/pendiente`;

  console.log("[checkout] baseUrl:", baseUrl);
  console.log("[checkout] successUrl:", successUrl);
  console.log("[checkout] failureUrl:", failureUrl);
  console.log("[checkout] pendingUrl:", pendingUrl);

  const mp = new MercadoPagoConfig({ accessToken: token });
  const preference = new Preference(mp);

  try {
    const preferenceBody = {
      items: mpItems,
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      // auto_return: "approved", // Comentado para desarrollo local con http://localhost
      statement_descriptor: "TIENDA NBA",
    };

    console.log("[checkout] preferenceBody:", JSON.stringify(preferenceBody, null, 2));

    const result = await preference.create({
      body: preferenceBody,
    });

    const payUrl = result.init_point ?? result.sandbox_init_point;
    if (!payUrl) {
      console.error("[checkout] Mercado Pago missing pay URL:", result);
      return NextResponse.json(
        { error: "Mercado Pago no devolvió URL de pago." },
        { status: 502 }
      );
    }

    return NextResponse.json({ url: payUrl });
  } catch (err) {
    console.error("[checkout] Mercado Pago exception:", err);
    if (err instanceof Error) {
      console.error("[checkout] Error message:", err.message);
      console.error("[checkout] Error stack:", err.stack);
    }
    return NextResponse.json(
      {
        error:
          "Hubo un error al conectar con Mercado Pago. Revisa el token y la configuración de tu cuenta.",
      },
      { status: 502 }
    );
  }
}
