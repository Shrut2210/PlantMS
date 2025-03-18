"use client"
import React from 'react'
import { LayoutGrid } from '../../ui/layout-grid';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";
import plant from "/public/images/plant.png"
import customer from "/public/images/customers.png"
import review from "/public/images/review.png"
import order from "/public/images/order.png"

export default function Page() {
  return (
    <div className='w-full  h-screen'>
      <LayoutGrid cards={cards}></LayoutGrid>
    </div>
  )
}

const SkeletonOne = () => {
  return (
    <div className='flex flex-col gap-2 justify-center items-center md:text-4xl text-xl'>
      <p className="font-bold md:text-4xl text-xl text-center text-white">
        Products
      </p>
      <Link href="/components/pages/adminProducts"><IoIosArrowForward  className='hover:text-green-600'/></Link>
    </div>
  );
};
 
const SkeletonTwo = () => {
  return (
    <div className='flex flex-col gap-2 justify-center items-center md:text-4xl text-xl'>
      <p className="font-bold text-white text-center">
        Customers
      </p>
      <Link href="/components/pages/adminCustomers"><IoIosArrowForward  className='hover:text-green-600'/></Link>
    </div>
  );
};
const SkeletonThree = () => {
  return (
    <div className='flex flex-col gap-2 justify-center items-center md:text-4xl text-xl'>
      <p className="font-bold md:text-4xl text-xl text-white text-center">
        Reviews
      </p>
      <Link href="/components/pages/adminReviews"><IoIosArrowForward  className='hover:text-green-600'/></Link>
    </div>
  );
};
const SkeletonFour = () => {
  return (
    <div className='flex flex-col gap-2 justify-center items-center md:text-4xl text-xl'>
      <p className="font-bold md:text-4xl text-xl text-white text-center">
        Orders
      </p>
      <Link href="/components/pages/adminOrders"><IoIosArrowForward  className='hover:text-green-600'/></Link>
    </div>
  );
};
 
const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2 text-center flex",
    thumbnail: plant
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: customer
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail : review
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail: order
  },
];
