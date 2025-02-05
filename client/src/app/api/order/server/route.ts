import { Order_Products } from "@/model/order_products";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Users } from "@/model/users";
import { Products } from "@/model/products";

export const GET = async (req: Request, res: NextResponse) => {

    await dbConnect();

    try {
        const admin = await req.headers.get('X-User-Id')

        if (!admin) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized"
            });
        }

        const products = await Products.find();
        const order_products = await Order_Products.find()
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}