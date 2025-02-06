import mongoose from "mongoose";

const productModel = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        menufecharBy : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Users',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        main_category: {
            type: String,
            required: true,
        },
        sub_category: {
            type: String,
        },
        image: [{
            type: String,
        }],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
        },
        ratings : {
            type: Number,
            required: true,
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                rating: {
                    type: Number,
                },
                comment: {
                    type: String,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            }
        ]
    }
)

export const Products = mongoose.models.Products || mongoose.model('Products', productModel);