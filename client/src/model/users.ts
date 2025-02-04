import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        email: { 
            type: String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: String, 
            required: true 
        }, // Hashed password
        role: { 
            type: String, 
            enum: ["customer", "admin"], 
            default: "customer" 
        },
        addresses: [
        {
            fullName: { 
                type: String, 
            },
            phone: { 
                type: String, 
            },
            street: { 
                type: String, 
            },
            city: { 
                type: String, 
            },
            state: { 
                type: String, 
            },
            postalCode: { 
                type: String, 
            },
            country: { 
                type: String, 
            },
        },
        ],
        wishlist : [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Products"
        }],
        cart: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Cart_Products" 
        }], 
        orders: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Order_Products"  
        }],
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        token : {
            type: String,
            default : ""
        }
    }
);
  
export const Users = mongoose.models.Users || mongoose.model('Users', userSchema);
  