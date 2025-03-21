'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoMdCart } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { FaAddressCard } from 'react-icons/fa';
import { IoMdTrash } from 'react-icons/io';
import { FaPen } from 'react-icons/fa';

export default function age() {

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        token: '',
        addresses: []
      });
      const [address, setAddress] = useState({
        name : '',
        phone : '',
        street : '',
        city : '',
        state : '',
        zip : ''
      })
      const [newAddress, setNewAddress] = useState({
        name : '',
        phone : '',
        street : '',
        city : '',
        state : '',
        zip : ''
      })
      const [showDialogOne, setShowDialogOne] = useState(false);

      const handleInputChange = (e:any) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

      useEffect(() => {
          fetch("/api/admin")
            .then((res) => res.json())
            .then((data) => {
              if (data.status === 200) {
                setUserData({
                  name: data.data.name,
                  email: data.data.email,
                  token: data.data.token,
                  addresses: data.data.addresses
                });
                setAddress(
                  {
                    name: '',
                    phone: '',
                    street: '',
                    city:'',
                    state: '',
                    zip: ''
                  }
                )
                
              } else {
                setUserData({name: '',
                  email: '',
                  token: '',
                  addresses: []});
              }
            })
            .catch((err) => console.error("Error fetching data:", err))
        }, []);

        const handleLogOut = async () => {
            const response = await fetch('/api/admin/logout')
        
            if(response.status === 200) {
              setUserData({name: '',
                email: '',
                token: '',
                addresses: []});
              toast.success("Logged out successfully!!");
              window.location.replace('/');
            } else {
              toast.error("Logging out Failed!!");
            }
          }

        const handleSave = async () => {
            console.log(address);
            console.log(newAddress);
            
            const response = await fetch('/api/admin', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    update_name: address.name, update_phone: address.phone, update_street: address.street, update_city: address.city, update_state: address.state, update_zip: address.zip, add_name: newAddress.name, add_phone: newAddress.phone, add_street: newAddress.street, add_city: newAddress.city, add_state: newAddress.state, add_zip: newAddress.zip
                })
            })

            if(response.status === 200) {
                setAddress({
                    name: '',
                    phone: '',
                    street: '',
                    city: '',
                    state: '',
                    zip: ''
                })
                setNewAddress({
                    name: '',
                    phone: '',
                    street: '',
                    city: '',
                    state: '',
                    zip: ''
                })
                toast.success("Address saved successfully!!");
                setShowDialogOne(false);
              } else {
                toast.error("Saving Address Failed!!");
              }
        }

        const handleDelete = async (addressToDelete : any) => {
          console.log("this is delete " , addressToDelete);
          
            const response = await fetch('/api/admin', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userData.token}`
              },
              body: JSON.stringify({
                delete_name: addressToDelete.name, delete_phone: addressToDelete.phone,
                delete_street: addressToDelete.street, delete_city: addressToDelete.city,
                delete_state: addressToDelete.state, delete_zip: addressToDelete.zip
              })
            });
          
            if (response.status === 200) {
              toast.success("Address deleted successfully!!");
            } else {
              toast.error("Failed to delete address!!");
            }
        };

  return (
    <div className='flex flex-col justify-center items-center p-7 text-2xl'>
        <div className='w-60 h-60'>
            <img src="https://i.pinimg.com/736x/cf/3f/5c/cf3f5c9f2d8362f9111cf7f7c93cf42f.jpg" alt="" />
        </div>
        <div>{userData.name}</div>
        <div>{userData.email}</div>
        <div className='grid grid-cols-2 gap-4 py-5'>
            <Link href="/components/pages/customerCart" className='flex justify-center items-center border py-10 px-16 text-3xl gap-4'><IoMdCart/>Cart</Link>
            <Link href="/components/pages/customerWishlist" className='flex justify-center items-center border py-10 px-16 text-3xl gap-4'><FaHeart/>WishList</Link>
            <Link href="/components/pages/customerOrder" className='flex justify-center items-center border py-10 px-16 text-3xl gap-4'><FaShoppingBag />Orders</Link>
            <div className='flex justify-center hover:cursor-pointer items-center border py-10 px-16 text-3xl' onClick={() => setShowDialogOne(true)}><FaAddressCard/> <span className='ml-5'>Addresses</span></div>
        </div>
        <div onClick={handleLogOut} className='bg-red-700 py-3 px-10 rounded-xl text-xl font-bold'>Logout</div>
        {showDialogOne && (
            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center z-50">
                <div className="w-2/3 p-5 rounded-lg flex backdrop-blur-lg border border-white/20 shadow-lg">
                    <div className="w-1/2 border-r p-4 max-h-96 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-3 text-white">Saved Addresses</h2>
                        {userData.addresses.length === 0 ? (
                            <p className="text-gray-300">No addresses added</p>
                        ) : (
                            userData.addresses.map((addr: any) => (
                                <div key={addr.phone} className="p-3 border-b border-gray-500 text-white">
                                    <p>
                                        <strong>{addr.name}</strong> - {addr.phone}
                                    </p>
                                    <p>{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                                    <div className='flex gap-2 '>
                                        <button className='py-1 px-2 hover:bg-green-700 bg-green-500' onClick={() => {setAddress(addr)}}><FaPen size={15}/></button>
                                        <button className='py-1 px-2 hover:bg-red-700 bg-red-500' onClick={() => handleDelete(addr)}><IoMdTrash size={17}/></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="w-1/2 p-4">
                        <div>Add Address</div>
                        <input type="text" name='name'  placeholder="Name"  onChange={handleInputChange} className="w-full p-2 border bg-transparent text-white placeholder-gray-400 mb-2" />
                        <input type="text" name='phone' placeholder="Phone" onChange={handleInputChange} className="w-full p-2 border bg-transparent text-white placeholder-gray-400 mb-2" />
                        <input type="text" name='street'  placeholder="Street" onChange={handleInputChange} className="w-full p-2 border bg-transparent text-white placeholder-gray-400 mb-2" />
                        <input type="text" name='city'   placeholder="City"  onChange={handleInputChange} className="w-full p-2 border bg-transparent text-white placeholder-gray-400 mb-2" />
                        <input type="text" name='state'  placeholder="State"  onChange={handleInputChange} className="w-full p-2 border bg-transparent text-white placeholder-gray-400 mb-2" />
                        <input type="text" name='zip'  placeholder="ZIP Code"  onChange={handleInputChange} className="w-full p-2 border bg-transparent text-white placeholder-gray-400 mb-4" />
                        <div className='flex gap-2'>
                            <button onClick={() => handleSave()} className="bg-green-500 text-white px-4 py-2 rounded w-full">Save</button>
                            <button onClick={() => setShowDialogOne(false)} className="bg-gray-500 text-white px-4 py-2 rounded w-full">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

