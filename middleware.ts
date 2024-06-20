import { NextRequest, NextResponse } from "next/server";
import { verify } from "@/assets/ts";

const JWT_SECRET = process.env.JWT_PRIVATE_KEY ?? "";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("token");
  let currentUser;
  if (token) {
    try {
      currentUser = await verify(token, JWT_SECRET);
    } catch (e) {
      url.pathname = "/login";
      return NextResponse.rewrite(url);
    }
  }

  if (currentUser) url.pathname = "/admin";
  else url.pathname = "/login";

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/", "/login", "/admin"],
};
