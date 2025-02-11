"use client"
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
import { json } from 'stream/consumers';
import { FaEdit } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'

export default function Page() {
    const [productData, setProductData] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [addProductData, setAddProductData] = useState({
        _id: '',
        name: '',
        menufecharBy: '',
        price: '',
        quantity: '',
        description: '',
        main_category: '',
        sub_category: '',
        image: ''
    });
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const category = [
        {
            main : "Plant",
            sub : ["Trending", "Typed", "Featured", "Seasoned", "Locality", "Foliage", "Flowering", "Colored"]
        },
        {
            main : "Seeds",
            sub : ["Trending", "Vegetables", "Herbs", "Flowers", "Forestry", "Tree", "Winter Sowing", "Other", "Sow in All Seasoned", "Easy to grow", "Named", "Featured", "Cuisined", "Colored"]
        },
        {
            main: "Bulbs",
            sub : ["Trending", "Sowing Timed", "Colored", "Named"]
        },
        {
            main: "Planters",
            sub : ["Trending", "Accessories", "Typed", "Sized", "Materialed", "Colored", "Shaped", "Finished", "Locality"]
        },
        {
            main: "Fertilizers",
            sub : ["Best Seller", "Packs", "Organic", "Potting", "Cocopeat", "Additives"]
        },
        {
            main: "Pebbles",
            sub : ["Trending", "Colored", "Sized", "Typed"]
        },
        {
            main: "Accessories",
            sub : ["Best Seller", "Clearance Sale", "Gardening Tools", "Miniature Toys", "Addons"]
        }
    ]

    useEffect(() => {
        fetchUserData();
        fetchProductData();
    }, []);

    const fetchProductData = async () => {
        const response = await fetch('/api/products/server')
        
        if(response.status === 200) {
            const data = await response.json()
            setProductData(data.body)
            setLoading(false)
        } else {
            console.error('Error fetching product data');
        }
    }

    const fetchUserData = async () => {
        const response = await fetch('/api/admin')
        
        if(response.status === 200) {
            const data = await response.json()
            setUserData(data.data);
            setLoading(false)
            setAddProductData(prev => ({...prev, menufecharBy: data.data?._id }));
        } else {
            console.error('Error fetching user data');
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
    
        const url = addProductData._id != '' ? `/api/products/server/${addProductData._id}` : "/api/products/server";
        const method = addProductData._id != '' ? "PUT" : "POST";
    
        console.log(addProductData);
    
        try {
            const response = await fetch(url, {
                method: method,
                body: JSON.stringify(addProductData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                alert(addProductData._id != '' ? "Product updated successfully!" : "Product added successfully!");
                setOpenDialog(false);
                setAddProductData({
                    _id: '',
                    name: '',
                    menufecharBy: '',
                    price: '',
                    quantity: '',
                    description: '',
                    main_category: '',
                    sub_category: '',
                    image: ''
                });
    
                fetchProductData();
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData);
                alert('Error updating product');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Network error');
        }
    };
    

    const handleEdit = (product:any) => {
        setAddProductData({
            _id: product._id,
            name: product.name,
            menufecharBy: product.menufecharBy,
            price: product.price,
            quantity: product.quantity,
            description: product.description,
            main_category: product.main_category,
            sub_category: product.sub_category,
            image: product.image
        });
    
        setOpenDialog(true);
    };

    const handleDelete = async (id:any) => {
        // Delete product
        const response = await fetch(`/api/products/server/${id}`, {
            method: 'DELETE',
        });
        
        if (response.status === 200) {
            alert("Product deleted successfully!");
            setProductData(productData.filter(product => product._id!== id));
        } else {
            console.error('Error deleting product');
            alert('Error deleting product');
        }
    }


    const showProducts = productData ? productData.map((product) => {
        return (
            <div className="flex gap-4 p-2 rounded-lg bg-black shadow-md shadow-zinc-700  text-white" key={product._id} >
                <div className="flex flex-col justify-between gap-2 w-full p-3">
                    <div className='flex flex-col gap-2'>
                        <img src={product.image} alt={product.name} className="w-full object-cover" />
                        <h3 className="text-xl font-bold">{product.name}</h3>
                        <p className="text-base text-blue-400">{product.price} Rs.</p>
                        <p className="text-sm text-red-300">{product.quantity} {product.quantity > 1? 'units' : 'unit'} remaining</p>
                    </div>
                    <div className='flex gap-3 mt-4 w-full  items-center justify-center'>
                        <button className='border hover:bg-green-700 px-5 py-2 rounded-lg' onClick={() => {
                            handleEdit(product)
                        }}><FaEdit size={21}/></button>
                        <button className='border hover:bg-red-700 px-5 py-2 rounded-lg' onClick={() => {handleDelete(product._id)}}><MdDelete size={21}/></button>
                    </div>
                </div>
            </div>
        )
    }) : null

    return (
        <div className="flex flex-col w-full p-7 relative gap-5 overflow-x-hidden">
            {openDialog && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-lg z-20">
                    <div className="bg-zinc-800 text-white flex flex-col justify-center items-center p-10 rounded-lg w-3/4">
                        <h2 className="text-3xl font-bold mb-4">Add Product</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                            <input type="hidden" name="_id" value={addProductData._id} />
                            <div className="flex gap-4 w-full">
                                <div className="flex flex-col gap-4 w-1/2">
                                    <input type="text" name="name" placeholder="Product Name" value={addProductData.name} className="border p-2 rounded bg-transparent placeholder:text-gray-300 text-gray-300" onChange={(e) => {setAddProductData({...addProductData, name: e.target.value})}} required />
                                    <select name="main_category" value={addProductData.main_category} className="border p-2 rounded bg-transparent placeholder:text-gray-300 text-gray-300" onChange={(e) => {setAddProductData({...addProductData, main_category: e.target.value})}} required>
                                        <option value="" className='text-black' disabled>Select Main Category</option>
                                        {category.map(cat => (
                                            <option className='bg-zinc-800' key={cat.main} value={cat.main}>{cat.main}</option>
                                        ))}
                                    </select>
                                    <input type="number" name="quantity" placeholder="Quantity" value={addProductData.quantity} className="border p-2 rounded bg-transparent placeholder:text-gray-300 text-gray-300" onChange={(e) => {setAddProductData({...addProductData, quantity: e.target.value})}} required />
                                </div>
                                <div className="flex flex-col gap-4 w-1/2">
                                    <input type="number" name="price" placeholder="Price" value={addProductData.price} className="border p-2 rounded bg-transparent placeholder:text-gray-300 text-gray-300" onChange={(e) => {setAddProductData({...addProductData, price: e.target.value})}} required />
                                    <select name="sub_category" value={addProductData.sub_category} className="border p-2 rounded bg-transparent placeholder:text-gray-300 text-gray-300" onChange={(e) => {setAddProductData({...addProductData, sub_category: e.target.value})}} required>
                                        <option value="" className='text-black' disabled>Select Sub Category</option>
                                        {(category.filter(cat => cat.main == addProductData.main_category)).flatMap(cat => cat.sub).map(cat => (
                                            <option className='bg-zinc-800' key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                    <input type="text" name="image" placeholder='Image URL' value={addProductData.image} className="border p-2 rounded bg-transparent placeholder:text-gray-300 text-gray-300" onChange={(e) => {setAddProductData({...addProductData, image: e.target.value})}} />
                                </div>
                            </div>
                            <textarea name="description" placeholder="Description" value={addProductData.description} className="border p-2 rounded bg-transparent placeholder:text-gray-300 text-gray-300" onChange={(e) => {setAddProductData({...addProductData, description: e.target.value})}} required></textarea>
                            <div className="flex justify-between">
                                <button type="button" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white" onClick={() => setOpenDialog(false)}>Cancel</button>
                                <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"> 
                                    { addProductData._id ? "Edit Product" : 'Add Product' }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="flex justify-evenly w-full">
                <div className="flex w-3/5 border rounded-lg items-center">
                    <input type="text" name="searchProduct" className="w-full py-1 bg-transparent indent-2 focus:outline-none" placeholder="Search..." />
                    <div className="bg-red-400 h-full rounded-lg flex items-center justify-center px-3 text-black font-bold text-2xl">
                        <IoIosSearch className="rounded-lg" />
                    </div>
                </div>
                <div className='flex gap-3'>
                    <select name="" id="" className='text-zinc-500 bg-black px-5 py-2 rounded-md border'>
                        <option value="">Category</option>
                        {category.map(cat => (
                                            <option className='bg-zinc-800' key={cat.main} value={cat.main}>{cat.main}</option>
                                        ))}
                    </select>
                    <button className="bg-green-700 py-2 px-10 font-bold rounded-md" onClick={() => setOpenDialog(true)}> Add Product</button>
                </div>
            </div>
            <div className='flex px-16'>
                <div className='grid grid-cols-4 gap-4 w-full px-10 py-5'>
                    {loading? 'Loading...' : showProducts}
                </div>
            </div>
        </div>
    )
}
