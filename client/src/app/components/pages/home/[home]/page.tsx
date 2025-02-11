"use client"
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { IoMdCart } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaStar } from 'react-icons/fa';

export default function ProductPage() {
  const [product, setProduct] = useState({})
  const params = useParams();
  const productId = params.home;
  console.log(params.home);
  const first = product.description ? product.description.indexOf('Growing Instructions') : 0
  const second = product.description ? product.description.indexOf('Care Instructions') : 0
  const third = product.description ? product.description.indexOf('Uses') : 0

  
  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/client/${productId}`);
      if (response.status === 200) {
        const data = await response.json();
        console.log(data);
        setProduct(data.data);
      } else {
        console.error("Error fetching product data");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleAddWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })

      if(res.status === 200) {
        alert("Product added to wishlist!");
      } else {
        alert("Error adding to wishlist!");
      }
    }
    catch (error) {
      console.error("Network error:", error);
    }
  }

  const handleAddCart = async () => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })
      if(res.status === 200) {
        alert("Product added to cart!");
      } else {
        alert("Error adding to cart!");
      }
    }
    catch (error) {
      console.error("Network error:", error);
    }
  }

  const handleBuyNow = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      })
      if(res.status === 200) {
        alert("Product added to cart!");
      } else {
        alert("Error adding to cart!");
      }
    }
    catch (error) {
      console.error("Network error:", error);
    }
  }

  useEffect(() => {
    fetchProduct();
  }, []); 

  return (
    <div className='flex justify-center items-center py-10'>
        <div className='flex flex-col w-3/4  p-5 gap-5 backdrop-blur-sm backdrop-brightness-50'>
          <div className='flex gap-5'>
            <div className=''>
              <img src={product.image} className='w-full' alt="" />
            </div>
            <div className='flex flex-col gap-2'>
                <div className='text-5xl font-bold'>{product.name}</div>
                <div className='flex gap-2'>
                {Array.from({ length: product.ratings }).map((_, index) => (
                  <FaStar key={index} className="text-yellow-500 w-5 h-5" fill="currentColor" />
                ))}
                </div>
                <div className='text-3xl'>$ {product.price}</div>
                <div><span className='font-bold text-2xl'>{product.quantity}</span> products available</div>
                <div>Category : <span className='font-bold'>{product.main_category} / {product.sub_category}</span></div>
                <div className='flex gap-3'>
                  <div className='py-3 text-black px-3 text-2xl rounded-full bg-red-400 hover:bg-red-500' 
                  onClick={handleAddWishlist}><abbr title="add to wishlist"><FaHeart /></abbr></div>
                  <div className='py-3 text-black px-3 text-2xl rounded-full bg-blue-400 hover:bg-blue-500' 
                  onClick={handleAddCart}><abbr title="add to cart"><IoMdCart /></abbr></div>
                  <div className='py-3 text-black px-3 text-2xl rounded-full bg-green-400 hover:bg-green-500' 
                  onClick={handleBuyNow}><abbr title="buy now"><FaShoppingBag /></abbr></div>
                </div>
            </div>
          </div>
          <div className='flex flex-col w-full'>
            <div className='my-5'>Description:</div>
            <div className='font-bold text-2xl my-2'>Growing Instructions :</div>
            <div className='text-base'>{product.description ? product.description.substring(first + 21, second) : null}</div>
            <div className='font-bold text-2xl my-2'>Care Instructions :</div>
            <div className='text-base'>{product.description ? product.description.substring(second + 18, third) : null}</div>
            <div className='font-bold text-2xl my-2'>Uses :</div>
            <div className='text-base'>{product.description ? product.description.substring(third+5) : null}</div>
          </div>
          <div>
            {product.reviews > 0 ? (
              <>
                <div>Reviews:</div>
                {product.reviews.map((review) => (
                  <div key={review.user}>
                    <div>{review.user}</div>
                    <div>{review.comment}</div>
                    <div>{review.rating}</div>
                  </div>
                ))}
              </>
            ) : (
              'No reviews'
            )}
          </div>
        </div>
    </div>
  )
}
