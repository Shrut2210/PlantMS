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
        },
        role: { 
            type: String, 
            enum: ["customer", "admin"], 
            default: "customer" 
        },
        addresses: [
        {
            name: { 
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
            zip: { 
                type: String, 
            }
        },
        ],
        wishlist : [{
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Products"
        }],
        cart: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Products"
        }], 
        orders: [
            {
                productId : { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: "Products"  
                },
                quantity : {
                    type: Number,
                }
            }
        ],
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
        token : {
            type: String,
            default : ""
        },
        invoice : [
            {
                items : [
                    {
                        productId : {
                            type: mongoose.Schema.Types.ObjectId, 
                            ref: "Products"
                        },
                        quantity : {
                            type: Number
                        },
                        price : {
                            type: Number
                        }
                    }
                ],
                payemntMode : {
                    type: String
                },
                address : {
                    name: {
                        type: String
                    },
                    phone: {
                        type: String
                    },
                    street: {
                        type: String
                    },
                    city: {
                        type: String
                    },
                    state: {
                        type: String
                    },
                    zip: {
                        type: String
                    }
                },
                createdAt : {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }
);
  
export const Users = mongoose.models.Users || mongoose.model('Users', userSchema);
  