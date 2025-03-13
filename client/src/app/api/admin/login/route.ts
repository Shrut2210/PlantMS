import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { Users } from "@/model/users";

export const POST = async (req: Request) => {
    const { email, password } = await req.json();

    await dbConnect();

    try {
        if (!email || !password) {
            return NextResponse.json({
                status: 400,
                message: "Missing required fields",
                function_name: "Login_user"
            });
        }

        const user = await Users.findOne({ email });

        if (!user) {
            return NextResponse.json({
                status: 404,
                message: "User not found",
                function_name: "Login_user"
            });
        }

        const match = await compare(password, user.password);

        if (!match) {
            return NextResponse.json({
                status: 401,
                message: "Incorrect password",
                function_name: "Login_user"
            });
        }

        const secretKey = process.env.SECRET_KEY as string;

        if (!secretKey) {
            throw new Error("Missing secret key");
        }

        const token = Jwt.sign({ _id: user._id, email: user.email }, secretKey, { expiresIn: "1d" });

        console.log("Generated Token:", token);

        user.token = token;
        await user.save();

        console.log("Updated User:", user);

        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            maxAge: 24 * 60 * 60 * 1000,
        });

        return NextResponse.json({
            status: 200,
            message: "Login successful",
            function_name: "Login_user"
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error",
            function_name: "Login_user"
        });
    }
};