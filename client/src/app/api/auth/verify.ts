import Jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: any, res: any) {
    const token = req.cookies.token;

    if (!token) {
        return NextResponse.json(
            {
                message: "No token found",
                status: 401,
            },
        );
    }

    try {
        const decodedToken = Jwt.verify(token, process.env.SECRET_KEY as string);

        return NextResponse.json({
            message: "Valid token",
            status: 200,
            user: decodedToken,
        });
    }
    catch (error) {
        return NextResponse.json(
            {
                message: "Invalid token",
                status: 401,
            },
        );
    }
}