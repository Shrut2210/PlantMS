import dbConnect from "@/lib/mongodb";
import { Cart_Products } from "@/model/cart_products";
import { Products } from "@/model/products";
import { Users } from "@/model/users";
import { log } from "console";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const POST = async (req : Request) => {
    await dbConnect();

    const token = (await cookies()).get("token")?.value || "";
    const {productId } = await req.json();

    try
    {
        const user = await Users.findOne({ token });
        if (!user) {
            return NextResponse.json({ status: 401, message: "Token not found" });
        }

        if(!user.cart.includes(productId))
        {
            user.cart.push(productId)
            await user.save();
        }

        const cart = await Cart_Products.findOne({ userId : user._id });
        if (!cart) {
            const newCart = await Cart_Products.create({ userId : user._id });
            newCart.items.push({productId: productId})
            await newCart.save();
        }
        else
        {
            cart.items.push({productId: productId})
            await cart.save();
        }

        return NextResponse.json({
            status: 200,
            message: "Product added to cart",
            function_name: "Cart_Post"
        });
    }
    catch (error)
    {
        console.error("Error in Cart_Post", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Cart_Post"
        });
    }
}

export const PUT = async (req: Request) => {
    await dbConnect();
    const token = (await cookies()).get("token")?.value || "";

    try {
        const user = await Users.findOne({ token });
        if (!user) {
            return NextResponse.json({ status: 401, message: "Token not found" });
        }

        const { productId, quantity } = await req.json();
        console.log(productId, quantity);
        
        const cart = await Cart_Products.findOne({ userId : user._id });
        if (!cart) {
            return NextResponse.json({ status: 404, message: "Cart not found" });
        }
        
        const itemIndex = cart.items.findIndex((item:any) => item.productId == productId);
        // console.log(itemIndex);
        
        if (itemIndex === -1) {
            return NextResponse.json({ status: 404, message: "Product not found in cart" });
        }

        if(quantity == 0)
        {
            cart.items.splice(itemIndex, 1);
            await cart.save();

            user.cart.splice(itemIndex, 1);
            await user.save();

            return NextResponse.json({
                status: 200,
                message: "Product removed from cart",
                function_name: "Cart_PUT"
            });

        }

        cart.items[itemIndex].quantity = quantity;
        await cart.save();

        return NextResponse.json({
            status: 200,
            message: "Quantity updated successfully",
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

export const DELETE = async (req:Request) => {
    await dbConnect();
    const token = (await cookies()).get("token")?.value || "";

    try {
        const user = await Users.findOne({ token });
        if (!user) {
            return NextResponse.json({ status: 401, message: "Token not found" });
        }
        
        const { productId } = await req.json();
        const cart = await Cart_Products.findOne({ userId : user._id });
        if (!cart) {
            return NextResponse.json({ status: 404, message: "Cart not found" });
        }
        
        const itemIndex = cart.items.findIndex((item:any) => item.productId == productId);
        if (itemIndex === -1) {
            return NextResponse.json({ status: 404, message: "Product not found in cart" });
        }
        
        cart.items.splice(itemIndex, 1);
        await cart.save();

        user.cart.splice(itemIndex, 1);
        await user.save();
        
        return NextResponse.json({
            status: 200,
            message: "Product removed successfully",
            function_name: "Cart_DELETE"
        });
    } catch (   error ) {
        console.error("Error in Cart_DELETE", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Cart_DELETE"
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

        const cart = await Cart_Products.findOne({ userId: user._id });
        if (!cart) {
            return NextResponse.json({ status: 404, message: "Cart not found" });
        }

        const products = await Products.find(); 
        let cartItems: any[] = [];

        products.forEach((product) => {
            const cartItem = cart.items.find((item: any) => item.productId.toString() === product._id.toString());

            if (cartItem) {
                cartItems.push({
                    ...product.toObject(), 
                    quantity: cartItem.quantity 
                });
            }
        });

        return NextResponse.json({
            status: 200,
            message: "Cart fetched successfully",
            body: cartItems, 
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
};
