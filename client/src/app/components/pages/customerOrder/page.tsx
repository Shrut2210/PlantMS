"use client"
import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'

export default function Page() {

    type Order = {
        _id: string,
        image: string,
        name: string,
        price: number,
        quantity: number
    }

    type InvoiceItem = {
        productId: string,
        quantity: number,
        price: number
    }

    type Invoice = {
        items: InvoiceItem[],
        paymentMode: string,
        address: {
            name: string,
            phone: string,
            street: string,
            city: string,
            state: string,
            zip: string
        },
        createdAt: string
    }

    const [userData, setUserData] = useState({
        _id: '',
        name: '',
        email: '',
        token: '',
        addresses: [],
        invoice: []
    });

    const [orderData, setOrderData] = useState<Order[]>([]);
    const [showDialogOne, setShowDialogOne] = useState(false);
    const [showDialogTwo, setShowDialogTwo] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedProductName, setSelectedProductName] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    const [review, setReview] = useState({
        rating: 1,
        comment: ''
    })
    
    useEffect(() => {
        fetchData();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const response = await fetch('/api/admin');
        if (response.status === 200) {
            const jsonData = await response.json();
            setUserData({
                ...userData,
                _id: jsonData.data._id,
                name: jsonData.data.name,
                email: jsonData.data.email,
                token: jsonData.token,
                addresses: jsonData.data.addresses,
                invoice: jsonData.data.invoice
            });
        }
    };

    const fetchData = async () => {
        try {
            const response = await fetch('/api/order');
            if (response.status === 200) {
                const jsonData = await response.json();
                setOrderData(jsonData.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleShowInvoice = (productId: string) => {
        const invoice = userData.invoice.find((inv: Invoice) =>
            inv.items.some((item) => item.productId === productId)
        );

        if (invoice) {
            const product = orderData.find((item) => item._id === productId);
            setSelectedProductName(product ? product.name : 'Unknown Product');
            setSelectedProductId(product ? product._id : 'Unknown Product');
            setSelectedInvoice(invoice);
            setShowDialogOne(true);
        }
    };

    const handleSubmitReview = async () => {
        setShowDialogTwo(false);

        const response = await fetch(`/api/products/client/${userData._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: selectedProductId,
                rating: review.rating,
                comment: review.comment,
                user: userData._id
            }),
        })

        if (response.status === 200) {
            toast.success('Review submitted successfully!');
        } else {
            toast.error('Failed to submit review. Please try again.');
        }
    }

    return (
        <div className='flex justify-center items-center py-10'>
            <ToastContainer aria-label="toast-container" 
                            position="top-center"
                            autoClose={5000} />
            <div className='flex flex-col gap-4 w-3/4 justify-center items-center'>
                <div className='text-4xl text-center'>Previous Orders</div>
                <div className='grid grid-cols-4 gap-5'>
                    {orderData.map((item) => (
                        <div key={item._id} className='flex justify-between flex-col gap-4'>
                            <div className='flex flex-col gap-1'>
                                <img src={item.image} alt="" />
                                <div>{item.name}</div>
                                <div>Price: ${item.price} </div>
                                <div>Quantity: {item.quantity} units</div>
                            </div>
                            <div className='w-full gap-1 flex justify-center items-center'>
                                <button 
                                    onClick={() => {setShowDialogTwo(true); setSelectedProductId(item._id)}} 
                                    className='bg-zinc-300 w-full text-black hover:bg-zinc-400 py-1 rounded-lg'
                                >
                                    Add Review
                                </button>
                                <button 
                                    onClick={() => handleShowInvoice(item._id)} 
                                    className='bg-zinc-300 w-full text-black hover:bg-zinc-400 py-1 rounded-lg'
                                >
                                    Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showDialogOne && selectedInvoice && (
                <div className="fixed inset-0 flex items-center w-screen h-screen justify-center backdrop-blur-lg bg-opacity-90">
                    <div className=" p-6 bg-black  rounded-lg shadow-lg ">
                        <h2 className="text-xl font-bold text-center">Invoice</h2>
                        <p><strong>Product:</strong> {selectedProductName}</p>
                        <p><strong>Quantity:</strong> {selectedInvoice.items.find(item => item.productId === selectedProductId)?.quantity || 0}</p>
                        <p><strong>Price per unit:</strong> ₹{selectedInvoice.items.find(item => item.productId === selectedProductId)?.price || 0}</p>
                        {/* <p><strong>Total Amount:</strong> ₹{selectedInvoice.items.find(item => item.productId === selectedProductId)?.quantity * selectedInvoice.items.find(item => item.productId === selectedProductId)?.price || 0}</p> */}
                        <p><strong>Payment Mode:</strong> {selectedInvoice.paymentMode}</p>
                        <p><strong>Address:</strong> {selectedInvoice.address.street}, {selectedInvoice.address.city}, {selectedInvoice.address.state}, {selectedInvoice.address.zip}</p>
                        <p><strong>Ordered On:</strong> {new Date(selectedInvoice.createdAt).toLocaleDateString()}</p>
                        <button onClick={() => setShowDialogOne(false)} className="bg-red-500 text-white py-2 px-4 mt-4 rounded-lg">Close</button>
                    </div>
                </div>
            )}
            {showDialogTwo && (
                <div className="fixed inset-0 flex items-center w-screen h-screen justify-center backdrop-blur-lg bg-opacity-90">
                    <div className=" p-6 bg-black flex flex-col w-1/3  rounded-lg shadow-lg ">
                        <h2 className="text-xl font-bold text-center py-5">Add Review</h2>
                        <form className='flex flex-col gap-2'>
                            <label className='text-sm' htmlFor="rating">Rating:</label>
                            <input type="number" className='bg-black' min="1" max="5" id="rating" name="rating" value={review.rating} onChange={(e) => setReview({...review, rating: parseInt(e.target.value) })} />
                            <textarea placeholder="Comment" className='bg-black' onChange={(e) => setReview({...review, comment: e.target.value })}/>
                        </form>
                        <div className='flex justify-between'>
                            <button type="submit" onClick={handleSubmitReview} className="bg-blue-500 text-white py-2 px-4 mt-4 rounded-lg">Submit</button>
                            <button onClick={() => setShowDialogTwo(false)} className="bg-red-500 text-white py-2 px-4 mt-4 rounded-lg">Close</button>
                        </div>
                    </div>
                </div>
            )
        }
        </div>
    );
}
