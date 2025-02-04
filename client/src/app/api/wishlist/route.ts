import { Wishlist_Products } from "@/model/wishlist_products";
import dbConnect from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: Request, res: NextResponse) => {
    await dbConnect()

    const userId = req.headers.get('X-User-Id');

    if (!userId) {
        return NextResponse.json({
            status: 401,
            message: "User ID not found",
            function_name: "Wishlist_Get"
        });
    }

    try {
        const wishlistProducts = await Wishlist_Products.find({ userId });

        if (!wishlistProducts.length) {
            return NextResponse.json({
                status: 404,
                message: "No wishlist products found"
            });
        }

        return NextResponse.json({
            status: 200,
            body: JSON.stringify(wishlistProducts),
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

    const userId = req.headers.get("X-User-Id");

    if (!userId) {
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

        let wishlist = await Wishlist_Products.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist_Products({
                userId,
                items: [{ productId }]
            });
        } else {
            const isProductInWishlist = wishlist.items.some(
                (item: any) => item.productId.toString() === productId
            );

            if (isProductInWishlist) {
                return NextResponse.json({
                    status: 409,
                    message: "Product already in wishlist",
                    function_name: "Wishlist_Post"
                });
            }

            wishlist.items.push({ productId });
        }

        await wishlist.save();

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
    const userId = req.headers.get("X-User-Id");

    const { productId } = await req.json();

    if (!userId || !productId) {
        return NextResponse.json({
            status: 400,
            message: "User ID and Product ID are required",
            function_name: "Wishlist_Delete"
        });
    }

    try {
        const wishlist = await Wishlist_Products.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        );
        if (!wishlist) {
            return NextResponse.json({
                status: 404,
                message: "Wishlist not found",
                function_name: "Wishlist_Delete"
            });
        }
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