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

        if( productId != 0 && quantity != 0 )
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

        const cartData = await Cart_Products.findOne({ userId: user._id });

        if (!cartData || cartData.items.length === 0) {
            return NextResponse.json({
                status: 404,
                message: "No cart items found",
            });
        }

        let orderProduct = await Order_Products.findOne({ userId: user._id });

        if (!orderProduct) {
            orderProduct = new Order_Products({
                userId: user._id,
                items: cartData.items.map((item:any) => ({
                    productId: item.productId,
                    quantity: item.quantity
                }))
            });
        } else {
            cartData.items.forEach((item:any) => {
                orderProduct.items.push({
                    productId: item.productId,
                    quantity: item.quantity
                });
            });
        }

        await orderProduct.save();

        await Cart_Products.deleteOne({ userId: user._id });
            
        return NextResponse.json({
            status: 200,
            message: "Cart items added to order",
            function_name: "Cart_PUT"
        });
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


// export const GET = async (req: Request, res: Response) => {
//     await dbConnect();
//     const token = (await cookies()).get("token")?.value || "";

//     try {
//         const user = await Users.findOne({ token });
//         if (!user) {
//             return NextResponse.json({ status: 401, message: "Token not found" });
//         }
        
//         const cart = await Order_Products.findOne({ userId : user._id });
//         if (!cart) {
//             return NextResponse.json({ status: 404, message: "Cart not found" });
//         }

//         let itemId:any = []

//         const product = await Products.find();

//         product.forEach((product) => {
//             if(cart.items.some({ productId : product._id}))
//             {
//                 itemId.push(product);
//             }
//         })
        
//         return NextResponse.json({
//             status: 200,
//             message: "Cart fetched successfully",
//             body: itemId,
//             function_name: "Cart_GET"
//         });
        
//     } catch (error) {
//         console.error("Error in Cart_GET", error);
//         return NextResponse.json({
//             status: 500,
//             message: "Server error",
//             function_name: "Cart_GET"
//         });
//     }
// }

export const GET = async (req: Request, res: Response) => {
    await dbConnect();
    const token = (await cookies()).get("token")?.value || "";

    try {
        const user = await Users.findOne({ token });
        if (!user) {
            return NextResponse.json({ status: 401, message: "Token not found" });
        }
        
        const order = await Order_Products.findOne({ userId: user._id });
        if (!order || order.items.length === 0) {
            return NextResponse.json({ status: 404, message: "No ordered items found" });
        }

        const productIds = order.items.map((item:any) => item.productId);
        const products = await Products.find({ _id: { $in: productIds } });

        const orderedProducts = products.map(product => {
            const orderItem = order.items.find((item:any) => item.productId.toString() === product._id.toString());
            return {
                ...product.toObject(),
                quantity: orderItem?.quantity || 0
            };
        });

        return NextResponse.json({
            status: 200,
            message: "Order fetched successfully",
            data: orderedProducts,
            function_name: "Order_GET"
        });

    } catch (error) {
        console.error("Error in Order_GET", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Order_GET"
        });
    }
};
