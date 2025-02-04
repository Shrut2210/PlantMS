import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Users } from "@/model/users";
import { Products } from "@/model/products";
import { cookies } from "next/headers";
import Jwt from "jsonwebtoken";
import { Order_Products } from "@/model/order_products";

export const POST = async (req: Request) => {
    await dbConnect();

    try {
        const { productId, quantity } = await req.json();

        if (!productId || !quantity) {
            return NextResponse.json({
                status: 400,
                message: "Product ID and quantity are required",
            });
        }

        const cookieStore = await cookies();
        const token = await cookieStore.get("token");

        if (!token) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized, no token provided",
            });
        }

        const secretKey = process.env.SECRET_KEY as string;
        const decoded = Jwt.verify(token, secretKey);

        const user = await Users.findById(decoded._id);
        if (!user) {
            return NextResponse.json({
                status: 404,
                message: "User not found",
            });
        }

        const product = await Products.findById(productId);
        if (!product) {
            return NextResponse.json({
                status: 404,
                message: "Product not found",
            });
        }

        let order = await Order_Products.findOne({ userId: user._id, status: "processing" });

        if (!order) {
            order = await Order_Products.create({
                userId: user._id,
                items: [{ productId, quantity, price: product.price * quantity }],
                totalAmount: product.price * quantity,
                paymentMethod: "cod", // Default for now
            });
        } else {
            // Check if product exists in order
            const existingItemIndex = order.items.findIndex((item:any) => item.productId.toString() === productId);

            if (existingItemIndex > -1) {
                // Update quantity and price
                order.items[existingItemIndex].quantity += quantity;
                order.items[existingItemIndex].price = product.price * order.items[existingItemIndex].quantity;
            } else {
                // Add new item
                order.items.push({ productId, quantity, price: product.price * quantity });
            }

            // Update total amount
            order.totalAmount = order.items.reduce((sum:any, item:any) => sum + item.price, 0);
            await order.save();
        }

        return NextResponse.json({
            status: 200,
            message: "Product added to order successfully",
            order,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};
