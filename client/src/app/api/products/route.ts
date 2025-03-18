import { Products } from "@/model/products";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const GET = async () => {

    await dbConnect();

    try {
        const products = await Products.find();

        if(!products)
        {
            return NextResponse.json({
                status: 404,
                message: 'No products found',
                function_name : 'Product_get'
            })
        }

        return NextResponse.json({
            status: 200,
            body : products,
            message: 'Products found',
            function_name : 'Product_get'
        }) 
    }
    catch (error)
    {
        return NextResponse.json({
            status: 500,
            message: 'Error while fetching products',
            function_name : 'Product_get',
            error : error
        })
    }
}