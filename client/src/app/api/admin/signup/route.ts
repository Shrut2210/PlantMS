import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import Jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dbConnect from "@/lib/mongodb";
import { Users } from "@/model/users";

export const POST = async (req: Request, res: Response) => {
    const { name, email, password, role } = await req.json();

    await dbConnect();

    try {
        if (!name || !email || !password || !role) {
            return NextResponse.json({
                status: 400,
                message: "Missing required fields",
                function_name: "Signup_user"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                status: 400,
                message: "Invalid email format",
                function_name: "Signup_user"
            });
        }

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                status: 400,
                message: "Email already in use",
                function_name: "Signup_user"
            });
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await Users.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();

        return NextResponse.json({
            status: 200,
            message: "User created successfully",
            data: newUser,
            function_name: "Signup_user"
        });
    } catch (error) {
        console.error("Error in signup_user", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Signup_user"
        });
    }
};

