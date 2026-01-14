// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;
  console.log(token)

  if (!token) {
    if (path.startsWith("/users") || path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    console.log(payload)
    const role = payload.role as string;

    if ((path === "/login" || path === "/register")) {
      return role === "admin"
        ? NextResponse.redirect(new URL("/admin/dashboard", req.url))
        : NextResponse.redirect(new URL("/users/account", req.url));
    }

    // ---------- กัน admin ----------
    if (path.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/users/account", req.url));
    }

    // ---------- กัน user ----------
    if (path.startsWith("/users") && role !== "steamer") {
      return NextResponse.redirect(new URL("/admin/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    // token ผิด / หมดอายุ
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.delete("token");
    return res;
  }
}

export const config = {
  matcher: ["/users/:path*", "/admin/:path*", "/login", "/register"],
};
