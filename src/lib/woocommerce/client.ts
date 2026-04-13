/**
 * WooCommerce REST API Client
 * 
 * Headless integration with WooCommerce backend.
 * Currently uses mock data from src/lib/data.ts.
 * When WooCommerce credentials are provided, set the environment
 * variables and this client will fetch live product data.
 * 
 * Required env vars:
 *   WOOCOMMERCE_URL=https://your-wordpress-site.com
 *   WOOCOMMERCE_CONSUMER_KEY=ck_xxx
 *   WOOCOMMERCE_CONSUMER_SECRET=cs_xxx
 */

const WC_URL = process.env.WOOCOMMERCE_URL || "";
const WC_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY || "";
const WC_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET || "";

const isConfigured = Boolean(WC_URL && WC_KEY && WC_SECRET);

interface WooCommerceRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  params?: Record<string, string>;
}

export async function woocommerceFetch<T>({
  endpoint,
  method = "GET",
  body,
  params = {},
}: WooCommerceRequestOptions): Promise<T> {
  if (!isConfigured) {
    throw new Error(
      "WooCommerce is not configured. Set WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, and WOOCOMMERCE_CONSUMER_SECRET in .env.local"
    );
  }

  const url = new URL(`/wp-json/wc/v3/${endpoint}`, WC_URL);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  // Basic auth via consumer key/secret
  const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");

  const response = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `WooCommerce API error [${response.status}]: ${errorBody}`
    );
  }

  return response.json();
}

// --- Product Queries ---

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  images: { src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  attributes: { name: string; options: string[] }[];
  stock_status: "instock" | "outofstock" | "onbackorder";
  meta_data: { key: string; value: string }[];
}

export async function getProducts(): Promise<WCProduct[]> {
  return woocommerceFetch<WCProduct[]>({
    endpoint: "products",
    params: { per_page: "100", status: "publish" },
  });
}

export async function getProductBySlug(slug: string): Promise<WCProduct | null> {
  const products = await woocommerceFetch<WCProduct[]>({
    endpoint: "products",
    params: { slug },
  });
  return products[0] || null;
}

export async function getProductsByCategory(categoryId: number): Promise<WCProduct[]> {
  return woocommerceFetch<WCProduct[]>({
    endpoint: "products",
    params: { category: String(categoryId), per_page: "100" },
  });
}

// --- Order Creation (for checkout) ---

export interface WCOrderLineItem {
  product_id: number;
  quantity: number;
}

export interface WCOrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
    address_1?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
  line_items: WCOrderLineItem[];
}

export async function createOrder(order: WCOrderPayload) {
  return woocommerceFetch({
    endpoint: "orders",
    method: "POST",
    body: order as unknown as Record<string, unknown>,
  });
}

// --- Status Check ---

export function isWooCommerceConfigured(): boolean {
  return isConfigured;
}
