import { Products } from "@/model/products";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const PUT = async (req: Request) => {
    try {
        const productId  = req.url.split("client/")[1];
        const { userId, rating, comment } = await req.json();

        if (!productId || !userId || !rating || !comment) {
            return NextResponse.json({
                status: 400,
                message: "Missing required fields",
                function_name: "Add_Product_Review"
            });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({
                status: 400,
                message: "Rating must be between 1 and 5",
                function_name: "Add_Product_Review"
            });
        }

        await dbConnect();

        const product = await Products.findById(productId);
        if (!product) {
            return NextResponse.json({
                status: 404,
                message: "Product not found",
                function_name: "Add_Product_Review"
            });
        }

        const newReview = {
            user: new mongoose.Types.ObjectId(userId),
            rating,
            comment,
            createdAt: new Date(),
        };

        product.reviews.push(newReview);

        await product.save();

        return NextResponse.json({
            status: 200,
            message: "Review added successfully",
            data: product.reviews,
            function_name: "Add_Product_Review"
        });

    } catch (error) {
        console.error("Error in Add_Product_Review", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Add_Product_Review"
        });
    }
};

export const GET = async (req: Request, res: NextResponse) => {

    await dbConnect();

    try {
        const productId  = req.url.split("client/")[1];

        console.log( "Server" + productId);
        
        
        if (!productId) {
            return NextResponse.json({
                status: 400,
                message: "Missing required fields",
                function_name: "Get_Product_Reviews"
            });
        }
        
        const product = await Products.findById(productId);
        
        if (!product) {
            return NextResponse.json({
                status: 404,
                message: "Product not found",
                function_name: "Get_Product_Reviews"
            });
        }
        
        return NextResponse.json({
            status: 200,
            message: "Reviews retrieved successfully",
            data: product,
            function_name: "Get_Product_Reviews"
        });
        
    } catch (error) {
        console.error("Error in Get_Product_Reviews", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Get_Product_Reviews"
        });
    }
}
