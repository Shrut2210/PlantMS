"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

    type Wishlist = {
        _id: number,
        image: string,
        name: string,
        price: number
    }

    const [wishlistData, setWishlistData] = useState<Wishlist[]>([]);

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
            toast.success('Product removed from wishlist!');
            // window.location.reload();
            fetchData()
        } catch (error) {
            toast.error('Error removing product from wishlist!');
        }
    }

    const product = wishlistData ? wishlistData.map((item) => {
        return (
            <div className='flex justify-between flex-col gap-4'>
                <Link href={'/components/pages/home/' + item._id} key={item._id}>
                        <div className="p-3 rounded-md relative overflow-hidden group">
                            <div className="relative overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full object-cover rounded-md transition-transform duration-300 ease-in-out group-hover:scale-110" />
                            </div>
                            <h3 className="text-white mt-2">{item.name}</h3>
                            <p className="text-gray-400">Price: ${item.price}</p>
                        </div>
                    </Link>
                <button className='bg-red-500 py-1 rounded-md hover:bg-red-600' onClick={() => handleRemoveFromWishlist(item._id)}>Remove</button>
            </div>
        )
    }) : null

  return (
    <div className='flex justify-center items-center py-5'>
        <ToastContainer aria-label="toast-container" 
            position="top-center"
            autoClose={5000} />
        <div className='flex flex-col gap-10 w-3/4 justify-center items-center'>
            <div className='text-4xl text-center'>Wishlist</div>
            <div className='grid grid-cols-4 gap-5'>
                {product}
            </div>
        </div>
    </div>
  )
}
