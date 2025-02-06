"use client"
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'

export default function Page() {
    const [productData, setProductData] = useState([])
    const [openDialog, setOpenDialog] = useState(false);
    const [addProductData, setAddProductData] = useState({
        name: '',
        menufecharBy: '',
        price: '',
        quantity: '',
        description: '',
        main_category: '',
        sub_category: '',
        image: null
    })
    const [userData, setUserData] = useState(null);
      const [loading, setLoading] = useState(true);
    
      useEffect(() => {
        fetch("/api/admin")
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 200) {
              setUserData(data.data);
              setAddProductData((prev => ({...prev, menufecharBy : data.data!._id})))
            } else {
              setUserData(null);
            }
          })
          .catch((err) => console.error("Error fetching data:", err))
          .finally(() => setLoading(false));
      }, []);

    const getProductData = async () => {
        const response = await fetch('/api/products')
        
        if(response.status === 200) {
            const data = await response.json()
            setProductData(data.products)
        } else {
            console.error('Error fetching product data')
            alert('Error fetching product data')
        }
    }

    const handleChange = (e:any) => {
        const { name, value } = e.target;
        setAddProductData(prev => ({ ...prev, [name]: value }));
    }

    const handleImageChange = (e:any) => {
        setAddProductData(prev => ({ ...prev, image: e.target.files[0] }));
    }

    const handleSubmit =  async () => {
        console.log(addProductData);
        
        const response = await fetch("api/products/server",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addProductData)
            }
        )

        if(response.status === 200) {
            alert("Product added successfully!");
            setOpenDialog(false);
            setAddProductData({
                name: '',
                menufecharBy: '',
                price: '',
                quantity: '',
                description: '',
                main_category: '',
                sub_category: '',
                image: null
            });
            // getProductData();
        } else {
            console.error('Error adding product');
            alert('Error adding product')
        }

    }

    return (
        <div className={`flex flex-col w-screen p-7 relative ${openDialog ? 'backdrop-blur-md' : ''}`}>
            {openDialog && (
                <div className='w-full fixed top-0 left-0 flex items-center justify-center backdrop-blur-lg z-20'>
                    <div className='bg-black flex flex-col justify-center items-center p-10 rounded-lg w-3/4'>
                        <h2 className='text-2xl font-bold mb-4'>Add Product</h2>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
                            <div className='flex gap-4 w-full'>
                                <div className='flex flex-col gap-4 w-1/2'>
                                    <input type='text' name='name' placeholder='Product Name' className='border p-2 rounded bg-transparent' onChange={handleChange} required />
                                    <select name='main_category' className='border p-2 rounded bg-transparent' onChange={handleChange} required>
                                        <option value='' className='text-black' disabled>Select Main Category</option>
                                        {['plants', 'bulbs', 'seeds', 'planters', 'soil', 'fertilizer', 'gifts', 'pebbles', 'Accessories'].map(cat => (
                                            <option className='text-black' key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <input type='number' name='quantity' placeholder='Quantity' className='border p-2 rounded bg-transparent' onChange={handleChange} required />
                                </div>
                                <div className='flex flex-col gap-4 w-1/2'>
                                    <input type='number' name='price' placeholder='Price' className='border p-2 rounded bg-transparent' onChange={handleChange} required />
                                    <input type='text' name='sub_category' placeholder='Sub Category' className='border p-2 rounded bg-transparent' onChange={handleChange} required />
                                    <input type='file' name='image' className='border p-2 rounded bg-transparent' onChange={handleImageChange} required />
                                </div>
                            </div>
                            <textarea name='description' placeholder='Description' className='border p-2 rounded bg-transparent' onChange={handleChange} required></textarea>
                            <div className='flex justify-between'>
                                <button type='button' className='bg-gray-600 px-4 py-2 rounded' onClick={() => setOpenDialog(false)}>Cancel</button>
                                <button type='submit' className='bg-green-600 text-white px-4 py-2 rounded'>Add Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className='flex justify-evenly w-full'>
                <div className='flex w-3/5 border rounded-lg items-center'>
                    <input type="text" name="searchProduct" className='w-full py-1 bg-transparent indent-2 focus:outline-none' placeholder='Search...'/>
                    <div className='bg-blue-400 h-full rounded-lg flex items-center justify-center px-3 text-black font-bold text-2xl'>
                        <IoIosSearch className='rounded-lg'/>
                    </div>
                </div>
                <button className='bg-green-700 py-2 px-10 font-bold rounded-md' onClick={() => setOpenDialog(true)}> Add Product</button>
            </div>
        </div>
    )
}
