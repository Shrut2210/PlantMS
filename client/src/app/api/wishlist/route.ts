import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { Users } from "@/model/users";
import { Products } from "@/model/products";

export const GET = async () => {
    await dbConnect()

    const token = (await cookies()).get("token")?.value || "";

    if (!token) {
        return NextResponse.json({
            status: 401,
            message: "User ID not found",
            function_name: "Wishlist_Get"
        });
    }

    try {

        const userData = await Users.findOne({token})

        if (!userData.wishlist) {
            return NextResponse.json({
                status: 404,
                message: "No wishlist products found"
            });
        }

        let items:any = []
        const product = await Products.find();

        product.forEach((product) => {
            if(userData.wishlist.includes(product._id))
            {
                items.push(product);
            }
        })

        return NextResponse.json({
            status: 200,
            body: items,
            message: "Wishlist products found"
        });
    }
    catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Wishlist_Get"
        });
    }
}

export const POST = async (req: NextRequest) => {
    await dbConnect();

    const token = (await cookies()).get("token")?.value || "";

    if (!token) {
        return NextResponse.json({
            status: 401,
            message: "Unauthorized",
            function_name: "Wishlist_Post"
        });
    }

    try {
        const { productId } = await req.json();

        if (!productId) {
            return NextResponse.json({
                status: 400,
                message: "Product ID is required",
                function_name: "Wishlist_Post"
            });
        }

        const userData = await Users.findOne({token})

        if (!userData.wishlist) {
            return NextResponse.json({
                status: 401,
                message: "Unauthorized",
                function_name: "Wishlist_Post"
            });
        }

        userData.wishlist.push(productId);
        await userData.save();

        return NextResponse.json({
            status: 200,
            message: "Product added to wishlist",
            function_name: "Wishlist_Post"
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Wishlist_Post"
        });
    }
};

export const DELETE = async (req: NextRequest) => {
    await dbConnect();
    const token = (await cookies()).get("token")?.value || "";

    const { productId } = await req.json();
    console.log(productId);
    

    if (!productId) {
        return NextResponse.json({
            status: 400,
            message: "User ID and Product ID are required",
            function_name: "Wishlist_Delete"
        });
    }

    try {
        const user = await Users.findOne({token})
        const index = user.wishlist.findIndex((wishlist:any) => wishlist == productId);
        if (index === -1) {
            return NextResponse.json({
                status: 404,
                message: "Product not found in wishlist",
                function_name: "Wishlist_Delete"
            });
        }
        user.wishlist.splice(index, 1);
        await user.save();
        
        return NextResponse.json({
            status: 200,
            message: "Product removed from wishlist",
            function_name: "Wishlist_Delete"
        });
        } catch (error) {
            console.error(error);
            return NextResponse.json({
                status: 500,
                message: "Server error",
                function_name: "Wishlist_Delete"
            });
    }
}