import dbConnect from "@/lib/mongodb";
import { Cart_Products } from "@/model/cart_products";
import { Order_Products } from "@/model/order_products";
import { Products } from "@/model/products";
import { Users } from "@/model/users";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
    await dbConnect();
    const token = (await cookies()).get("token")?.value || "";

    try {
        const user = await Users.findOne({ token });
        if (!user) {
            return NextResponse.json({ status: 401, message: "Token not found" });
        }

        const { productId, quantity, paymentMode, userAddress } = await req.json();

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

            const productData = await Products.findOne({ _id: productId });

            if (productData) {
                await Products.updateOne(
                    { _id: productId },
                    { $set: { quantity: productData.quantity - quantity } }
                );
            }
            
            await Users.updateOne({
                _id: user._id
                },
                {
                    $push : { orders : {productId, quantity}}
                }
            )

            await Users.updateOne(
                { _id: user._id },
                {
                    $push: {
                        invoice: {
                            items: [
                                {
                                    productId,
                                    quantity,
                                    price: productData.price
                                }
                            ],
                            paymentMode: paymentMode,
                            address: userAddress
                        }
                    }
                }
            );
            
            return NextResponse.json({
                status: 200,
                message: "Order Placed successfully",
                function_name: "Order_PUT"
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

        if(cartData && cartData.items.length > 0)
        {   
            for(const item of cartData.items)
            {
                await Products.updateOne(
                    {_id : item.productId},
                    { $inc : { quantity : -item.quantity}}
                )
            }
        }

        await Users.updateOne({
            _id: user._id
            },
            {
                $push : { orders : cartData.items.map((item:any) => ({
                    productId: item.productId,
                    quantity: item.quantity
                 }))
                }
            }
        )

        await Users.updateOne(
            { _id: user._id },
            {
                $push: {
                    invoice: {
                        $each: cartData.items.map((item: any) => ({
                            items: [
                                {
                                    productId: item.productId,
                                    quantity: item.quantity,
                                    price: item.price
                                }
                            ],
                            paymentMode: paymentMode,
                            address: userAddress
                        }))
                    }
                }
            }
        );


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

export const GET = async () => {
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

        const orderedProducts = order.items.map((item:any) => {
            const orderItem = products.find((p:any) => item.productId.toString() === p._id.toString());
            return {
                ...orderItem?.toObject(),
                quantity: item?.quantity || 0
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
