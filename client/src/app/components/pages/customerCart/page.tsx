"use client"
import React, { useEffect, useState } from 'react'

export default function CartPage() {

    const [cartData, setCartData] = useState([])

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
                        Total Product : {cartData.length}
                        <div>Total Price : $ {cartData.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0)}</div>
                        <button className='bg-green-700 hover:bg-green-800 my-5 py-2 px-5 text-lg rounded-xl text-black font-bold'>Procced to Buy</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
