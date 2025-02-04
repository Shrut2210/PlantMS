import { Products } from "@/model/products";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const POST = async (req: Request, res: Response) => {
    try {
        const { name, menufecharBy, price, quantity, description, category, image } = await req.json();

        if (!name || !menufecharBy || !price || !quantity || !description || !category || !image.length) {
            return NextResponse.json({
                status: 400,
                message: "Missing required fields",
                function_name: "Product_Post"
            });
        }

        await dbConnect();

        const newProduct = await Products.create({
            name,
            menufecharBy,
            price,
            quantity,
            description,
            category,
            image,
            ratings : 1,
            createdAt: new Date(),
        });

        return NextResponse.json({
            status: 200,
            message: "Product created successfully",
            data: newProduct,
            function_name: "Product_Post"
        });

    } catch (error) {
        console.error("Error in Create_Product", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Product_Post"
        });
    }
}