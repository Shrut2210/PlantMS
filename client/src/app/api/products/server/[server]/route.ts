import { Products } from "@/model/products";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const PUT = async (req: Request) => {
    try {
        const productId  = req.url.split("server/")[1];
        const { _id, name, menufecharBy, price, quantity, description, main_category, sub_category, image } = await req.json();
        
        if (!productId || !name || !menufecharBy || !price || !quantity || !description || !main_category) {
            return NextResponse.json({
                status: 400,
                message: "Missing required fields",
                function_name: "Product_Put"
            });
        }
        
        await dbConnect();
        
        const updatedProduct = await Products.findByIdAndUpdate(
            _id,
            {
                name,
                menufecharBy,
                price,
                quantity,
                description,
                main_category,
                sub_category,
                image,
                updatedAt: new Date(),
            },
            { new: true }
        )
        
        if (!updatedProduct) {
            return NextResponse.json({
                status: 404,
                message: "Product not found",
                function_name: "Product_Put"
            });
        }
        
        return NextResponse.json({
            status: 200,
            message: "Product updated successfully",
            data: updatedProduct,
            function_name: "Product_Put"
        });
        
    } catch (error) {
        console.error("Error in Update_Product", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Product_Put"
        });
    }
}

export const DELETE = async (req: Request) => {
    try {
        
        const productId  = req.url.split("server/")[1];
        
        if (!productId) {
            return NextResponse.json({
                status: 400,
                message: "Missing required fields",
                function_name: "Product_Delete"
            });
        }
        
        await dbConnect();
        
        const deletedProduct = await Products.findByIdAndDelete(productId);
        
        if (!deletedProduct) {
            return NextResponse.json({
                status: 404,
                message: "Product not found",
                function_name: "Product_Delete"
            });
        }
        
        return NextResponse.json({
            status: 200,
            message: "Product deleted successfully",
            data: deletedProduct,
            function_name: "Product_Delete"
        });
        
    } catch (error) {
        console.error("Error in Delete_Product", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Product_Delete"
        });
    }
}