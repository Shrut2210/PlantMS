import { Products } from "@/model/products";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Users } from "@/model/users";

export const GET = async () => {
    await dbConnect();

    const token = (await cookies()).get("token")?.value || "";
    
      if (!token) {
        return NextResponse.json({ status: 401, message: "Token not found" });
      }

      try {
        const user = await Users.findOne({ token });
        
        if (!user) {
            return NextResponse.json({ status: 401, message: "User not authenticated" });
        }

        
        
        const products = await Products.find({ menufecharBy : user._id });
        // console.log(products);
        
        if (!products.length) {
            return NextResponse.json({ status: 404, message: "No products found" });
        }

        return NextResponse.json({
            status: 200,
            body : products,
            message: "Products found",
            function_name: "Product_Get"
        });
      } catch (error) {
        console.error("Error in Get_Products", error);
        return NextResponse.json({
            status: 500,
            message: "Server error",
            function_name: "Product_Get"
        });
      }
    }

export const POST = async (req: Request) => {
    try {
        const { _id, name, menufecharBy, price, quantity, description, main_category, sub_category, image } = await req.json();

        if (!name || !menufecharBy || !price || !quantity || !description || !main_category ) {
            return NextResponse.json({
                status: 400,
                message: "Missing required fields",
                function_name: "Product_Post"
            });
        }

        await dbConnect();

        const newProduct = await Products.create({
            name :name,
            menufecharBy :menufecharBy,
            price :price,
            quantity :quantity,
            description :description,
            main_category :main_category,
            sub_category :sub_category,
            ratings : 1,
            createdAt: new Date(),
        });

        if(image !== "")
        {
            newProduct.image.push(image);
            await newProduct.save();
        }

        if(!newProduct)
        {
            return NextResponse.json({
                status: 500,
                message: "Failed to create product",
                function_name: "Product_Post"
            });
        }

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