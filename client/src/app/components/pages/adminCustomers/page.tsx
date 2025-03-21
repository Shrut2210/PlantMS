"use client"
import React, { useEffect, useState } from "react";

export default function Page() {
  type Order = {
    productId: string;
    quantity: number;
    price: number;
    productName?: string;
    productPrice?: number;
  };

  type Users = {
    name: string;
    email: string;
    orders: Order[];
  };

  const [userData, setUserData] = useState<Users[]>([]);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api");

      if (response.status === 200) {
        const jsonData = await response.json();
        setUserData(jsonData.data);
        console.log(jsonData);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="p-6">
      {userData && userData.length > 0 ? (
        userData.map((user, index) => (
          <div key={index} className="mb-6 shadow-md shadow-zinc-500 p-4">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-zinc-400">{user.email}</p>
            <h3 className="mt-2 font-semibold">Orders:</h3>
            {user.orders.length > 0 ? (
              <ul className="list-disc ml-6">
                {user.orders.map((order, orderIndex) => (
                  <li key={orderIndex} className="text-zinc-400">
                    {order.productName} - {order.quantity} x ${order.productPrice ?? order.price}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No orders found</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No users found</p>
      )}
    </div>
  );
}
