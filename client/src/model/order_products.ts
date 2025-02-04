import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
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
            quantity: { 
                type: Number, 
                required: true 

            },
            price: { 
                type: Number, 
                required: true 

            },
        },
        ],
        orderedAt: { 
            type: Date, 
            default: Date.now 
        },
    }
);
  
export const Order_Products = mongoose.models.Order_Products || mongoose.model("Order_Products", orderSchema)
  
// totalAmount: { 
        //     type: Number, 
        //     required: true 
        // },
        // paymentStatus: { 
        //     type: String, 
        //     enum: ["pending", "paid", "failed"], 
        //     default: "pending" 
        // },
        // paymentMethod: { 
        //     type: String, 
        //     enum: ["card", "paypal", "cod"], 
        //     required: true 
        // },
        // shippingAddress: {
        //     fullName: { 
        //         type: String, 
        //         required: true 
        //     },
        //     phone: { 
        //         type: String, 
        //         required: true 
        //     },
        //     street: { 
        //         type: String, 
        //         required: true 
        //     },
        //     city: { 
        //         type: String, 
        //         required: true 
        //     },
        //     state: { 
        //         type: String, 
        //         required: true 
        //     },
        //     postalCode: { 
        //         type: String, 
        //         required: true 
        //     },
        //     country: { 
        //         type: String, 
        //         required: true 
        //     },
        // },
        // status: { 
        //     type: String, 
        //     enum: ["processing", "shipped", "delivered", "canceled"], 
        //     default: "processing" 
        // },