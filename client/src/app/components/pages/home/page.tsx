// "use client"
// import Image from 'next/image'
// import React, { useState, useEffect } from 'react'
// import cat_plant from "/public/images/cat_plant.jpg"
// import cat_seed from "/public/images/cat_seed.jpg"
// import cat_acc from "/public/images/cat_acc.jpg"
// import cat_bulb from "/public/images/cat_bulb.jpg"
// import cat_pebble from "/public/images/cat_pebble.webp"
// import cat_planter from "/public/images/cat_planter.jpg"
// import cat_soil from "/public/images/cat_soil.jpg"
// import Link from 'next/link'

// export default function Page() {
    
//     type Product = {
//         _id: number,
//         name: string,
//         price: number,
//         image: string,
//         main_category: string
//     }

//     const [productData, setProductData] = useState<Product[]>([]);

//     const [searchQuery, setSearchQuery] = useState('')
//     const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

//     useEffect(() => {
//         fetchProductData()
//     }, [])

//      const fetchProductData = async () => {
//             const response = await fetch('/api/products')
            
//             if(response.status === 200) {
//                 const data = await response.json()
//                 setProductData(data.body)
//                 setFilteredProducts(data.body)
//             } else {
//                 console.error('Error fetching product data');
//             }
//         }

//     const category = [
//         {
//             main : "Plant",
//             sub : ["Trending", "Typed", "Featured", "Seasoned", "Locality", "Foliage", "Flowering", "Colored"],
//             image : cat_plant
//         },
//         {
//             main : "Seeds",
//             sub : ["Trending", "Vegetables", "Herbs", "Flowers", "Forestry", "Tree", "Winter Sowing", "Other", "Sow in All Seasoned", "Easy to grow", "Named", "Featured", "Cuisined", "Colored"],
//             image : cat_seed
//         },
//         {
//             main: "Bulbs",
//             sub : ["Trending", "Sowing Timed", "Colored", "Named"],
//             image : cat_bulb
//         },
//         {
//             main: "Planters",
//             sub : ["Trending", "Accessories", "Typed", "Sized", "Materialed", "Colored", "Shaped", "Finished", "Locality"],
//             image : cat_planter
//         },
//         {
//             main: "Fertilizers",
//             sub : ["Best Seller", "Packs", "Organic", "Potting", "Cocopeat", "Additives"],
//             image : cat_soil
//         },
//         {
//             main: "Pebbles",
//             sub : ["Trending", "Colored", "Sized", "Typed"],
//             image : cat_pebble
//         },
//         {
//             main: "Accessories",
//             sub : ["Best Seller", "Clearance Sale", "Gardening Tools", "Miniature Toys", "Addons"],
//             image : cat_acc
//         }
//     ]

//     const products = filteredProducts.length > 0 ? filteredProducts.filter((prod) => prod.main_category === searchQuery).map((prod) => 
//     {
//         return (
//             <Link href={'home/' + prod._id}>
//                 <div key={prod._id} className='flex flex-col gap-3 w-full'>
//                     <img src={prod.image} alt={prod.name} className="w-full object-cover" />
//                     <div className='flex flex-col'>
//                         <h2>{prod.name}</h2>
//                         <p>Price: ${prod.price}</p>
//                     </div>
//                 </div>
//             </Link>
//         )
//     }
//     ) : null

//   return (
//     <div className='w-full flex flex-col gap-5 justify-center items-center'>
//         <div className='flex gap-2 justify-between w-3/4 border bg-transparent'>
//             <div className='flex gap-2 w-4/5'>
//                 <select name="" id="" className=' bg-zinc-800 px-5 py-3 border-none border'>
//                     <option value=''  className='' disabled>Select Category</option>
//                     {category.map(cat => (
//                         <option className='bg-zinc-800' key={cat.main} value={cat.main}
//                         onSelect={() => setSearchQuery(cat.main)}>{cat.main}</option>
//                     ))}
//                 </select>
//                 <input type="text" placeholder="What are you looking for ?" 
//                 className='w-full bg-transparent focus:outline-none indent-2' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
//             </div>
//             <button className='bg-green-600 hover:bg-green-700 text-white px-4 py-1'>Search</button>
//         </div>
//         {/* <div className='flex gap-2 pt-3 justify-center items-center'>
//             {
//                 category.map((cat) => (
//                     <select name="" id="" className=' bg-black py-3 border-none border'>
//                         <option value="">{cat.main}</option>
//                         {cat.sub.map((sub) => (
//                             <option key={sub} value={sub}>{sub}</option>
//                         ))}
//                     </select>
//                 ))
//             }
//         </div> */}
//         <div className='flex gap-2 w-3/4'>
//             {
//                 category.map((cat) => (
//                     <div className='flex gap-2 my-4' key={cat.main}>
//                         <Image src={cat.image} alt=''  className='w-32 h-32 opacity-60 rounded-full object-cover' />
//                     </div>
//                 ))
//             }
//         </div>
//         <div className='flex justify-center items-center w-4/5 py-5'>
//             <div className='grid grid-cols-4 gap-5'>
//                 {products}
//             </div>
//         </div>
//     </div>
//   )
// }

'use client';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';


import cat_plant from '/public/images/cat_plant.jpg';
import cat_seed from '/public/images/cat_seed.jpg';
import cat_acc from '/public/images/cat_acc.jpg';
import cat_bulb from '/public/images/cat_bulb.jpg';
import cat_pebble from '/public/images/cat_pebble.webp';
import cat_planter from '/public/images/cat_planter.jpg';
import cat_soil from '/public/images/cat_soil.jpg';

export default function Page() {
    type Product = {
        _id: number;
        name: string;
        price: number;
        image: string;
        main_category: string;
    };

    const [productData, setProductData] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Toggle for mobile sidebar
    
    useEffect(() => {
        fetchProductData();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchQuery, selectedCategory]);

    const fetchProductData = async () => {
        const response = await fetch('/api/products');
        if (response.status === 200) {
            const data = await response.json();
            setProductData(data.body);
            setFilteredProducts(data.body);
        } else {
            console.error('Error fetching product data');
        }
    };

    const filterProducts = () => {
        let filtered = productData;
        if (searchQuery) {
            filtered = filtered.filter((prod) => prod.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (selectedCategory) {
            filtered = filtered.filter((prod) => prod.main_category === selectedCategory);
        }
        setFilteredProducts(filtered);
    };

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

            const filtered = filteredProducts.filter((prod) => {
                return (
                  (selectedCategory ? prod.main_category === selectedCategory : true) &&
                  (searchQuery ? prod.name.toLowerCase().includes(searchQuery.toLowerCase()) : true)
                );
              });

    return (
        <div className="flex flex-col w-full">
            <div className="w-full flex flex-col items-center gap-5 p-5">
                <div className="flex w-3/4 border p-1 rounded-md">
                    <input
                        type="text"
                        placeholder="What are you looking for?"
                        className="w-full bg-transparent text-white outline-none p-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-green-600 text-white px-4 py-2 rounded-md">Search</button>
                </div>

                <div className="flex gap-5">
                {category.map((cat) => (
                    <div
                    key={cat.main}
                    className="relative w-32 h-32 cursor-pointer group"
                    onClick={() => setSelectedCategory(cat.main)}
                    >
                    <Image src={cat.image} alt={cat.main} className="rounded-full w-full h-full opacity-60" />
                    <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 bg-black/50 text-white text-lg font-semibold rounded-full transition-all">
                        {cat.main}
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="flex w-full justify-center items-center">
                <div className="flex p-5 w-[80%]">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {filtered.map((prod) => (
                    <Link href={"home/" + prod._id} key={prod._id}>
                        <div className="p-3 rounded-md relative overflow-hidden group">
                            <div className="relative overflow-hidden">
                                <img src={prod.image} alt={prod.name} className="w-full object-cover rounded-md transition-transform duration-300 ease-in-out group-hover:scale-110" />
                            </div>
                            <h3 className="text-white mt-2">{prod.name}</h3>
                            <p className="text-gray-400">Price: ${prod.price}</p>
                        </div>
                    </Link>
                    ))}
                </div>
                </div>
            </div>
        </div>
    );
}
