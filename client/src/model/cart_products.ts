import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
    {
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Users", 
            required: true 
        },
        items : [
            {
                productId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "Products", 
                    required: true 
    
                },
                quantity: { 
                    type: Number, 
                    required: true, 
                    min: 1 
    
                },
                addedAt: { 
                    type: Date, 
                    default: Date.now 
    
                },
            }
        ]
    }
);
  
export const Cart_Products = mongoose.models.Cart_Products || mongoose.model("Cart_Products", cartItemSchema)
  