import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSubdomain } from "@/lib/subdomain";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Refresh the Supabase auth session (keeps the user logged in).
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options?: any }[]
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );
  await supabase.auth.getUser();

  // Multi-tenant routing: jane.market.place -> /s/jane/*
  const host = request.headers.get("host");
  const subdomain = getSubdomain(host);
  const { pathname, search } = request.nextUrl;

  if (subdomain) {
    const url = request.nextUrl.clone();
    url.pathname = `/s/${subdomain}${pathname === "/" ? "" : pathname}`;
    const rewritten = NextResponse.rewrite(url, { request });
    // carry over any refreshed auth cookies
    response.cookies.getAll().forEach((c) => rewritten.cookies.set(c));
    return rewritten;
  }

  return response;
}

export const config = {
  // run on everything except static assets & the storefront api
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
