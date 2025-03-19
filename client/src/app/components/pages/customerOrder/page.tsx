"use client"
import React, { useEffect, useState } from 'react'

export default function Page() {

    type Order = {
        image: string,
        name: string,
        price: number,
        quantity: number
    }

    const [orderData, setOrderData] = useState<Order[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/order')
            console.log(response);
            if(response.status === 200) {
                const jsonData = await response.json()
                setOrderData(jsonData.data)
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const product = orderData ? orderData.map((item) => {
        return (
            <div className='flex justify-between flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                    <img src={item.image} alt="" />
                    <h3>{item.name}</h3>
                    <p>$ {item.price} </p>
                    <p>{item.quantity} units</p>
                </div>
            </div>
        )
    }) : null

  return (
    <div className='flex justify-center items-center py-10'>
        <div className='flex flex-col gap-4 w-3/4 justify-center items-center'>
            <div className='text-4xl text-center'>Previous Orders</div>
            <div className='grid grid-cols-4 gap-5'>
                {product}
            </div>
        </div>
    </div>
  )
}
