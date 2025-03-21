"use client"
import React, { useEffect, useState } from 'react'

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
        name: '',
        email: '',
        token: '',
        addresses: [],
        invoice: []
    });

    const [orderData, setOrderData] = useState<Order[]>([]);
    const [showDialogOne, setShowDialogOne] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [selectedProductName, setSelectedProductName] = useState('');
    const [selectedProductId, setSelectedProductId] = useState('');
    
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

    return (
        <div className='flex justify-center items-center py-10'>
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
                                <button 
                                    onClick={() => handleShowInvoice(item._id)} 
                                    className='bg-zinc-300 text-black hover:bg-zinc-400 py-1 rounded-lg'
                                >
                                    Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showDialogOne && selectedInvoice && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className=" p-6 rounded-lg shadow-lg w-1/3">
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

        </div>
    );
}
