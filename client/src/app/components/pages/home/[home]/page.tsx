"use client"
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoMdCart } from "react-icons/io";
import { FaCheckCircle, FaShoppingBag } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaStar } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {

  const [userData, setUserData] = useState({
    name : '',
    email: '',
    token: '',
    addresses: [
      {
        name : '',
        phone : '',
        street : '',
        city : '',
        state : '',
        zip : ''
      }
    ],
    invoice: [
      {
          items: [
              {
                  productId: '',
                  quantity: 0,
                  price: 0
              }
          ],
          paymentMode: '',
          address: {
              name: '',
              phone: '',
              street: '',
              city: '',
              state: '',
              zip: ''
          },
          createdAt: new Date()
      }
  ]
  })

  const [product, setProduct] = useState({
    id: '',
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    ratings: '',
    quantity: '',
    main_category: '',
    sub_category: '',
    reviews: [
      {
        user: '',
        comment: '',
        rating: ''
      }
    ],
  })
  const params = useParams();
  const productId = params.home;
  console.log(params.home);
  const first = product.description ? product.description.indexOf('Growing Instructions') : 0
  const second = product.description ? product.description.indexOf('Care Instructions') : 0
  const third = product.description ? product.description.indexOf('Uses') : 0
  const [quantity , setQuantity] = useState(1);
  const [showDialogOne, setShowDialogOne] = useState(false);
  const [showDialogTwo, setShowDialogTwo] = useState(false);
  const [showDialogThree, setShowDialogThree] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [userAddress, setUserAddress] = useState({
    name: "",
    phone: "",
    street : "",
    city: "",
    state: "",
    zip: ""
  })
  const paymentModes = ["UPI", "Cash On Delivery", "Credit Card", "Debit Card"];

  const fetchUser = async () => {
    const response = await fetch('/api/admin');
    if(response.status === 200) {
      const jsonData = await response.json();
      setUserData({...userData, name: jsonData.data.name, email: jsonData.data.email, token: jsonData.token, addresses: jsonData.data.addresses, invoice : jsonData.data.invoice })
    }
  }
  
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
        toast.success("Product added to wishlist!")
      } else {
        toast.error("Product adding to wishlist failed!");
      }
    }
    catch (error) {
      toast.error("Product adding to wishlist failed!");
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
        toast.success("Product added to cart!");
      } else {
        toast.error("Product adding to cart failed!");
      }
    }
    catch (error) {
      toast.error("Product adding to cart failed!");
    }
  }

  const handleBuyNow = async () => {
    try {
      const res = await fetch("/api/order", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, paymentMode, userAddress}),
      })

      if(res.status === 200) {
        setShowDialogTwo(false)
        setShowDialogOne(false)
        setShowDialogThree(true)
      } else {
        toast.error("Product order failed!");
      }
    }
    catch (error) {
      toast.error("Product order failed!");
    }
  }

  useEffect(() => {
    fetchProduct();
    fetchUser();
  }, []); 

  return (
    <div className='flex justify-center items-center py-10'>
      <ToastContainer aria-label="toast-container" 
      position="top-center"
      autoClose={5000} />
        <div className='flex flex-col w-3/4  p-5 gap-5 backdrop-blur-sm backdrop-brightness-50'>
          <div className='flex gap-5'>
            <div className=''>
              <img src={product.image} className='w-full' alt="" />
            </div>
            <div className='flex flex-col gap-2'>
                <div className='text-5xl font-bold'>{product.name}</div>
                <div className='flex gap-2'>
                {Array.from({ length: parseInt(product.ratings) }).map((_, index) => (
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
                  onClick={() => setShowDialogOne(true)}><abbr title="buy now"><FaShoppingBag /></abbr></div>
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
            {product.reviews.length > 0 ? (
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
        {
          showDialogOne && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
              <div className="w-1/3 p-6 bg-black text-white rounded-lg shadow-lg flex flex-col items-center gap-4">
                
                <div className="text-xl font-bold">Payment Mode</div>
                <div className="w-full flex flex-col gap-2">
                  {paymentModes.map((mode) => (
                    <button
                    onSelect={() => setPaymentMode(mode)}
                      key={mode}
                      className="w-full py-2 px-4 text-lg text-white focus:bg-zinc-600 bg-zinc-800 hover:bg-zinc-600 rounded-md transition duration-300"
                      tabIndex={0}
                      aria-label={`Select ${mode} as payment mode`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="text-xl font-bold">Quantity</div>
                <div className="flex gap-4 text-3xl items-center">
                  <button
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-500 rounded-full"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="min-w-[40px] text-center">{quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-500 rounded-full"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
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
                {userData.addresses.length > 0 ? (
                  userData.addresses.map((address) => (
                    <button
                    onClick={() => setUserAddress({
                      name: address.name,
                      phone: address.phone,
                      street: address.street,
                      city: address.city,
                      state: address.state,
                      zip: address.zip,
                    })}
                      key={address.phone}
                      className="w-full py-2 px-4 text-lg focus:bg-zinc-600 text-white bg-zinc-800 hover:bg-zinc-600 rounded-md transition duration-300"
                      tabIndex={0}
                      aria-label={`Select ${address.name} as shipping address`}
                    >
                      {address.name} - {address.street}, {address.city}, {address.state}, {address.zip}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-600">No addresses found.</p>
                )}
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
        {showDialogThree && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md">
          <div className="w-1/3 p-6 bg-white text-black rounded-lg shadow-lg flex flex-col items-center gap-4 animate-fadeIn">
            <FaCheckCircle className="text-green-500" size={60} />

            <div className="text-xl font-bold text-center">Order Placed Successfully!</div>
            <p className="text-gray-600 text-center">Thank you for your purchase. Your order is on the way.</p>

            {/* ✅ Check if invoice exists before accessing data */}
            {userData?.invoice?.length > 0 ? (
              <div className="w-full p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Invoice</h3>
                <p className="text-gray-700"><strong>Name:</strong> {userData.name}</p>
                <p className="text-gray-700"><strong>Buying Date:</strong> {new Date(userData.invoice[0]?.createdAt).toLocaleDateString()}</p>
                
                <div className="mt-3">
                  <h4 className="text-md font-semibold">Purchased Items:</h4>
                  <ul className="list-disc pl-5">
                    {userData.invoice[0]?.items?.map((item, index) => (
                      <li key={index} className="text-gray-800">
                        <strong>Product:</strong> {item.productId} | 
                        <strong> Quantity:</strong> {item.quantity} | 
                        <strong> Price:</strong> ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No invoice available.</p>
            )}

            <button
              className="py-2 px-6 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition"
              onClick={() => { setShowDialogThree(false); setShowDialogOne(false); }}
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
