import dbConnect from "@/lib/mongodb";
import { Products } from "@/model/products";
import { Users } from "@/model/users";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
    await dbConnect();
    const token = (await cookies()).get("token")?.value || "";

    try {
        const admin = await Users.findOne({ token : token });
        const allUser = await Users.find();
        
        if (!admin) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized: Admin not found",
            });
        }

        const userWithOrder = allUser.filter((order) => order.orders.length > 0)

        const productIds = userWithOrder.flatMap((ids) =>
            ids.orders.map((order:any) => order.productId)
        )

        const products = await Products.find(
            { _id: { $in: productIds },
            menufecharBy: admin._id
         }
        )

        const userData = userWithOrder.map((user:any) => ({
            name: user.name,
            email: user.email,
            orders: user.orders.map((order: any) => {
                const product = products.find((p) => p._id.toString() === order.productId.toString());
                return product
                    ? { ...order, productName: product.name, productPrice: product.price, quantity: order.quantity }
                    : order;
            })
        }));
        // console.log(userData);

        if (userData.length > 0) {
            return NextResponse.json({
                status: 200,
                data: userData,
            });
        }

        return NextResponse.json({
            status: 404,
            message: "No users with orders found",
        });
    }
    catch (error) {
        console.error("Error in GET_Users", error);
        return NextResponse.json({
            status: 500,
            message: "Server error"
        });
    }
}