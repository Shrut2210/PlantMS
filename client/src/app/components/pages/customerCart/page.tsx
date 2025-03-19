"use client"
import React, { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa';

export default function Page() {

    type CartItem = {
        _id: string;
        name: string;
        image: string;
        price: number;
        quantity: number;
    };
    

    const [cartData, setCartData] = useState<CartItem[]>([]);
    const [showDialogOne, setShowDialogOne] = useState(false);
    const [showDialogTwo, setShowDialogTwo] = useState(false);
    const [showDialogThree, setShowDialogThree] = useState(false);
    const [userAddress, setUserAddress] = useState({
        name: "",
        phone: "",
        street : "",
        city: "",
        state: "",
        zip: "",
        country: ""
    })
    const paymentModes = ["UPI", "Cash On Delivery", "Credit Card", "Debit Card"];

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setUserAddress((prev) => ({ ...prev, [name]: value }));
    };

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart')
            if(response.status === 200) {
                const jsonData = await response.json()
                setCartData(jsonData.body)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const handleBuyNow = async () => {
        try {
          const res = await fetch("/api/order", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({productId : 0, quantity : 0}),
          })
    
          const res2 = await fetch("/api/admin", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userAddress),
          })
    
          if(res.status === 200) {
            setShowDialogTwo(false)
            setShowDialogOne(false)
            setShowDialogThree(true)
          } else {
            alert("Error adding to cart!");
          }
        }
        catch (error) {
          console.error("Network error:", error);
        }
      }

    const handleRemoveFromCart = async (id:any) => {
        try {
            await fetch(`/api/cart`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: id }),
            })
            fetchCart()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleUpdateQuantity = async (id: any, quantity: number) => {
        try {
            await fetch(`/api/cart`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: id, quantity: quantity }),
            })
            fetchCart()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const product = cartData ? cartData.map((item) => (
        <div key={item._id} className='flex gap-4'>
            <img src={item.image} alt={item.name} className='w-40 h-40'/>
            <div className='flex flex-col w-full'>
                <h3>{item.name}</h3>
                <p>$ {item.price} </p>
                <div className="flex gap-2 items-center justify-center text-2xl">
                    <button className=" px-2" onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className=" px-2" onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <button className='bg-red-500 py-1 my-2 w-full rounded-md hover:bg-red-600' onClick={() => handleRemoveFromCart(item._id)}>Remove</button>
            </div>
        </div>
    )) : <div className="text-xl">Cart is empty</div>

    return (
        <div className='flex justify-center items-center py-5'>
            <div className='flex flex-col gap-4 w-3/4 justify-center items-center'>
                <div className='text-4xl text-center mb-10'>Cart</div>
                <div className='flex gap-5 justify-between'>
                    <div className='flex flex-col gap-2 w-3/5'>
                        {product}
                    </div>
                    <div className='flex flex-col gap-1'>
                        Total Product : { cartData ? cartData.length : 0}
                        <div>Total Price : $ { cartData ? cartData.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0) : 0}</div>
                        <button className='bg-green-700 hover:bg-green-800 my-5 py-2 px-5 text-lg rounded-xl text-black font-bold' onClick={() => setShowDialogOne(true)}>Procced to Buy</button>
                    </div>
                </div>
            </div>
            {
                showDialogOne && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    <div className="w-1/3 p-6 bg-black text-white rounded-lg shadow-lg flex flex-col items-center gap-4">
                    
                    <div className="text-xl font-bold">Payment Mode</div>
                    <div className="w-full flex flex-col gap-2">
                        {paymentModes.map((mode) => (
                        <button
                            key={mode}
                            className="w-full py-2 px-4 text-lg text-white bg-gray-800 hover:bg-gray-600 rounded-full transition duration-300"
                            tabIndex={0}
                            aria-label={`Select ${mode} as payment mode`}
                        >
                            {mode}
                        </button>
                        ))}
                    </div>
                    <div className="flex justify-between gap-4">
                        <button
                        className="py-2 px-6 bg-red-500 hover:bg-red-600 rounded-md transition"
                        onClick={() => setShowDialogOne(false)}
                        >
                        Cancel
                        </button>
                        <button
                        className="py-2 px-6 bg-blue-500 hover:bg-blue-600 rounded-md transition"
                        onClick={() => setShowDialogTwo(true)}
                        >
                        Next
                        </button>
                    </div>
    
                    </div>
                </div>
                )
            }
            {
                showDialogTwo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    <div className="w-1/3 p-6 bg-black text-white rounded-lg shadow-lg flex flex-col items-center gap-4">
                    <div className="text-xl font-bold">Shipping Address</div>
    
                    <div className="flex flex-col gap-2 w-full">
                        {["name", "phone", "street", "city", "state", "zip", "country"].map((field) => (
                        <input
                            key={field}
                            type="text"
                            name={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={userAddress[field as keyof typeof userAddress]}
                            onChange={handleChange}
                            className="w-full px-4 py-2 text-lg rounded-md focus:outline-none bg-black border"
                            aria-label={`Enter ${field}`}
                        />
                        ))}
                    </div>
    
                    <div className="flex justify-between gap-4 w-full">
                        <button
                        className="py-2 px-6 bg-red-500 hover:bg-red-600 rounded-md transition"
                        onClick={() => {setShowDialogTwo(false); setShowDialogOne(false)}}
                        >
                        Cancel
                        </button>
                        <button
                        className="py-2 px-6 bg-blue-500 hover:bg-blue-600 rounded-md transition"
                        onClick={() => handleBuyNow()}
                        >
                        Buy Now
                        </button>
                    </div>
                    </div>
                </div>
                )
            }
            {
                showDialogThree && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
                    <div className="w-1/3 p-6 bg-white text-black rounded-lg shadow-lg flex flex-col items-center gap-4 animate-fadeIn">
                    <FaCheckCircle className="text-green-500" size={60} />
    
                    <div className="text-xl font-bold text-center">Order Placed Successfully!</div>
                    <p className="text-gray-600 text-center">Thank you for your purchase. Your order is on the way.</p>
    
                    <button
                        className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
                        onClick={() => {setShowDialogThree(false); setShowDialogOne(false)}}
                    >
                        Continue Shopping
                    </button>
                    </div>
                </div>
                )
            }
        </div>
    )
}
