'use client'
import React, { useEffect, useState } from 'react'

export default function Page() {

  type Review = {
    user: string,
    rating: number,
    comment: string
  }

  type Product = {
    _id: string,
    name: string,
    price: number,
    quantity: number,
    description: string,
    image: string,
    menufecharBy: string,
    reviews: Review[]
  }

  const [userData, setUserData] = useState({
    _id : '',
    name: '',
    email: ''
  })

  const [productData, setProductData] = useState<Product[]>([]);

  const fetchUser = async () => {
    const response = await fetch('/api/admin');
    if (response.status === 200) {
      const jsonData = await response.json();
      setUserData({
        _id: jsonData.data._id,
        name: jsonData.data.name,
        email: jsonData.data.email
      });
    }
  }

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products`);
      if (response.status === 200) {
        const jsonData = await response.json();
        setProductData(jsonData.body);
      } else {
        console.error('Error fetching product data');
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }

  useEffect(() => {
    fetchUser();
    fetchProduct();
  }, []);

  return (
    <div className='flex w-full h-full justify-center items-center'>
    <div className="flex flex-col items-center w-4/5 justify-center p-10">
      <h1 className="text-3xl font-bold mb-6 ">Products with Reviews</h1>
      <div className="grid grid-cols-4 gap-6 w-full">
        {productData.filter(product => product.reviews.length > 0).length > 0 ? (
          productData
          .filter(product => product.reviews.length > 0)
          .map((product) => (
            <div key={product._id} className="p-4 rounded-lg shadow-lg w-full">
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
                <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
                <p className="text-green-600 font-bold">₹{product.price}</p>
                <p className="text-sm">Quantity: {product.quantity}</p>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold">Reviews:</h3>
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-t pt-2 mt-2">
                      <p className="text-yellow-500">⭐ {review.rating}/5</p>
                      <p className="italic">"{review.comment}"</p>
                      <p className="text-gray-400 text-sm">- {review.user}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products with reviews available</p>
          )}
      </div>
    </div>
    </div>
  )
}
