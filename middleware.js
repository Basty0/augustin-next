import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("userToken");

  if (!token) {
    if (req.nextUrl.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } else {
    if (req.nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }
  return NextResponse.next();
}

// Define the routes that will trigger the middleware
export const config = {
  matcher: ["/home", "/dashboard", "/profile"], // Add the routes to protect
};
