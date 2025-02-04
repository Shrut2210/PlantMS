import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Users", 
            required: true 

        },
        items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Products", 
                required: true 

            },
        },
        ],
    }
);
  
export const Wishlist_Products = mongoose.models.Wishlist_Products || mongoose.model("Wishlist_Products", wishlistSchema)
  