import handler from "@/app/api/auth/verify";
import { NextRequest, NextResponse } from "next/server";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function middleware(req : NextRequest) {
    const token = req.cookies.get('token')?.value;

    if (!token) {
        return NextResponse.redirect(new URL('/api/admin/login', req.url));
    }
    try {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error("Missing secret key");
        }

        const decoded: any = Jwt.verify(token, secretKey);

        const res = NextResponse.next();
        res.headers.set("X-User-Id", decoded._id);

        return res;
    } catch (error) {
        console.error(error);
        return NextResponse.redirect(new URL("/api/admin/login", req.url));
    }
}

export const config = {
    matcher: ['/api/admin/*', '/api/cart', '/api/order', '/api/products/*', '/api/wishlist'],
}