"use client"
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import cat_plant from "/public/images/cat_plant.jpg"
import cat_seed from "/public/images/cat_seed.jpg"
import cat_acc from "/public/images/cat_acc.jpg"
import cat_bulb from "/public/images/cat_bulb.jpg"
import cat_pebble from "/public/images/cat_pebble.webp"
import cat_planter from "/public/images/cat_planter.jpg"
import cat_soil from "/public/images/cat_soil.jpg"
import Link from 'next/link'

export default function page() {
    const [productData, setProductData] = useState([])

    const [searchQuery, setSearchQuery] = useState('')
    const [filteredProducts, setFilteredProducts] = useState([])

    useEffect(() => {
        fetchProductData()
    }, [])

     const fetchProductData = async () => {
            const response = await fetch('/api/products')
            
            if(response.status === 200) {
                const data = await response.json()
                setProductData(data.body)
                setFilteredProducts(data.body)
            } else {
                console.error('Error fetching product data');
            }
        }

    const category = [
        {
            main : "Plant",
            sub : ["Trending", "Typed", "Featured", "Seasoned", "Locality", "Foliage", "Flowering", "Colored"],
            image : cat_plant
        },
        {
            main : "Seeds",
            sub : ["Trending", "Vegetables", "Herbs", "Flowers", "Forestry", "Tree", "Winter Sowing", "Other", "Sow in All Seasoned", "Easy to grow", "Named", "Featured", "Cuisined", "Colored"],
            image : cat_seed
        },
        {
            main: "Bulbs",
            sub : ["Trending", "Sowing Timed", "Colored", "Named"],
            image : cat_bulb
        },
        {
            main: "Planters",
            sub : ["Trending", "Accessories", "Typed", "Sized", "Materialed", "Colored", "Shaped", "Finished", "Locality"],
            image : cat_planter
        },
        {
            main: "Fertilizers",
            sub : ["Best Seller", "Packs", "Organic", "Potting", "Cocopeat", "Additives"],
            image : cat_soil
        },
        {
            main: "Pebbles",
            sub : ["Trending", "Colored", "Sized", "Typed"],
            image : cat_pebble
        },
        {
            main: "Accessories",
            sub : ["Best Seller", "Clearance Sale", "Gardening Tools", "Miniature Toys", "Addons"],
            image : cat_acc
        }
    ]

    const products = filteredProducts.length > 0 ? filteredProducts.map((prod) => 
    {
        return (
            <Link href={'home/' + prod._id}>
                <div key={prod._id} className='flex flex-col gap-3 w-full'>
                    <img src={prod.image} alt={prod.name} className="w-full object-cover" />
                    <div className='flex flex-col'>
                        <h2>{prod.name}</h2>
                        <p>Price: ${prod.price}</p>
                    </div>
                </div>
            </Link>
        )
    }
    ) : null

  return (
    <div className='w-full flex flex-col gap-5 justify-center items-center'>
        <div className='flex gap-2 justify-between w-3/4 border bg-transparent'>
            <div className='flex gap-2 w-4/5'>
                <select name="" id="" className=' bg-zinc-800 px-5 py-3 border-none border'>
                    <option value=''  className=''>Select Category</option>
                    {category.map(cat => (
                        <option className='bg-zinc-800' key={cat.main} value={cat.main}>{cat.main}</option>
                    ))}
                </select>
                <input type="text" placeholder="What are you looking for ?" 
                className='w-full bg-transparent focus:outline-none indent-2' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-1'>Search</button>
        </div>
        <div className='flex gap-2 pt-3 justify-center items-center'>
            {
                category.map((cat) => (
                    <select name="" id="" className=' bg-black py-3 border-none border'>
                        <option value="">{cat.main}</option>
                        {cat.sub.map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                        ))}
                    </select>
                ))
            }
        </div>
        <div className='flex gap-2 w-3/4'>
            {
                category.map((cat) => (
                    <div className='flex gap-2 my-4' key={cat.image}>
                        <Image src={cat.image} alt=''  className='w-32 h-32 opacity-60 rounded-full object-cover' />
                    </div>
                ))
            }
        </div>
        <div className='flex justify-center items-center w-4/5 py-5'>
            <div className='grid grid-cols-4 gap-5'>
                {products}
            </div>
        </div>
    </div>
  )
}