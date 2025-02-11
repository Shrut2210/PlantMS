import dbConnect from "@/lib/mongodb";
import { Cart_Products } from "@/model/cart_products";
import { Order_Products } from "@/model/order_products";
import { Products } from "@/model/products";
import { Users } from "@/model/users";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export const PUT = async (req: Request, res : Response) => {
    await dbConnect();
    const token = (await cookies()).get("token")?.value || "";

    try {
        const user = await Users.findOne({ token });
        if (!user) {
            return NextResponse.json({ status: 401, message: "Token not found" });
        }

        const { productId, quantity } = await req.json();

        if(productId && quantity )
        {
            const directOrder = await Order_Products.findOne({ userId : user._id})

            if(directOrder)
            {
                directOrder.items.push({
                    productId,
                    quantity
                })
                await directOrder.save();
            }
            else
            {
                const newOrder = new Order_Products({
                    userId : user._id,
                    items : [{
                        productId,
                        quantity
                    }]
                })
                await newOrder.save();
            }

            return NextResponse.json({
                status: 200,
                message: "Product added to cart",
                function_name: "Cart_PUT"
            });
        }

        const cartData = await Cart_Products.find()

        if (!cartData.length) {
            return NextResponse.json({
                status: 404,
                message: "No cart items found"
            });
        }

        const orderProduct = await Order_Products.findOne({userId : user._id})
        if(!orderProduct)
            {
                const newOrder = new Order_Products({
                    userId : user._id,
                    items : cartData.map((item) => ({
                        productId : item._id,
                        quantity : item.quantity
                    }))
                })
                await newOrder.save();
            }
            else
            {
                orderProduct.items = cartData.map((item) => ({
                    productId : item._id,
                    quantity : item.quantity
                }))
                await orderProduct.save();
            }
    }
    catch (error) {
        console.error("Error in Cart_PUT", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Cart_PUT"
        });
    }
} 


export const GET = async (req: Request, res: Response) => {
    await dbConnect();
    const token = (await cookies()).get("token")?.value || "";

    try {
        const user = await Users.findOne({ token });
        if (!user) {
            return NextResponse.json({ status: 401, message: "Token not found" });
        }
        
        const cart = await Order_Products.findOne({ userId : user._id });
        if (!cart) {
            return NextResponse.json({ status: 404, message: "Cart not found" });
        }

        let itemId:any = []

        const product = await Products.find();

        product.forEach((product) => {
            if(cart.items.includes(product._id))
            {
                itemId.push(product);
            }
        })
        
        return NextResponse.json({
            status: 200,
            message: "Cart fetched successfully",
            data: itemId,
            function_name: "Cart_GET"
        });
        
    } catch (error) {
        console.error("Error in Cart_GET", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Cart_GET"
        });
    }
}