"use client"
import React, { useEffect, useState } from 'react'

export default function page() {

    const [wishlistData, setWishlistData] = useState([])

    const fetchData = async () => {
        try {
            const response = await fetch('/api/wishlist')
            console.log(response);
            if(response.status === 200) {
                const jsonData = await response.json()
                setWishlistData(jsonData.body)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleRemoveFromWishlist = async (id:any) => {
        try {
            await fetch(`/api/wishlist`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId: id }),
            })
            fetchData()
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const product = wishlistData ? wishlistData.map((item) => {
        return (
            <div className='flex justify-between flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <img src={item.image} alt="" />
                    <h3>{item.name}</h3>
                    <p>$ {item.price} </p>
                </div>
                <button className='bg-red-500 py-1 rounded-md hover:bg-red-600' onClick={() => handleRemoveFromWishlist(item._id)}>Remove</button>
            </div>
        )
    }) : null

  return (
    <div className='flex justify-center items-center py-10'>
        <div className='flex flex-col gap-4 w-3/4 justify-center items-center'>
            <div className='text-4xl text-center'>Wishlist</div>
            <div className='grid grid-cols-4 gap-5'>
                {product}
            </div>
        </div>
    </div>
  )
}
