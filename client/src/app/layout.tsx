"use client";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import logo from '/public/images/logo.png';
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { FaHome } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { FaShoppingBag } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import github from "/public/images/25231.png";
import linkedin from "/public/images/702300.png";
import google from "/public/images/google-g-icon-removebg-preview.png"
import facebook from "/public/images/facebook.png"
import instagram from "/public/images/Instagram_logo_2016.svg.webp"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Router } from "next/router";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>)

{
  const pathname = usePathname();
  const hideHeader = pathname.includes("/components/pages/signup")
  const [userData, setUserData] = useState({
    name: '',
    role: '',
    email: '',
    token: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setUserData({
            name: data.data.name,
            role: data.data.role,
            email: data.data.email,
            token: data.data.token
          });
          
        } else {
          setUserData({name: '',
            role: '',
            email: '',
            token: ''});
        }
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleLogOut = async () => {
    const response = await fetch('/api/admin/logout')

    if(response.status === 200) {
      setUserData({name: '',
        role: '',
        email: '',
        token: ''});
      toast.success("Logged out successfully!!");
      window.location.replace('/');
    } else {
      toast.error("Logging out Failed!!");
    }
  }

  return (
    <html lang="en">
      <ToastContainer aria-label="toast-container" 
      position="top-center"
      autoClose={5000} />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-serif`}
      >
        { !hideHeader && <header>
          <div className='flex justify-between items-center h-20 p-2 bg-black'>
            <Image src={logo} alt='Logo' width={120} height={100} />
            <div className="flex">
              {userData.token ? 
                (userData.role == 'customer' ? 
                  <div className="flex justify-center items-center ">
                    <Link href='/components/pages/home'>
                        <div className='text-white pe-4 rounded-md text-2xl hover:text-green-400'><FaHome /></div>
                      </Link>
                    <Link className="flex flex-col hover:cursor-pointer hover:underline"
                    href="/components/pages/customerProfile">
                      <div className="text-zinc-300 -mb-2">Hello,</div>
                      <div className="text-xl">{userData.name}</div>
                    </Link>
                      {/* 
                      <Link href='/components/pages/customerWishlist'>
                        <div className='text-white pe-4 rounded-md text-xl hover:text-green-400'><FaHeart /></div>
                      </Link>
                      <Link href='/components/pages/customerCart'>
                        <div className='text-white pe-4 rounded-md text-xl hover:text-green-400'><IoMdCart /></div>
                      </Link>
                      <Link href='/components/pages/customerOrder'>
                        <div className='text-white pe-4 rounded-md text-xl hover:text-green-400'><FaShoppingBag /></div>
                      </Link>
                      <div onClick={handleLogOut}>
                        <div className='me-4 px-3 py-1 hover:cursor-pointer hover:bg-green-500 text-black bg-green-400 rounded-md'>Logout</div>
                      </div> */}
                  </div>
                  : 
                  <div className="flex justify-center items-center">
                      <Link href='/components/pages/adminHome'>
                      <div className='text-white pe-4 hover:text-gray-500 rounded-md'>Home</div>
                    </Link>
                      <div onClick={handleLogOut}>
                        <div className='me-4 px-3 hover:bg-green-500 cursor-pointer py-1 text-black bg-green-400 rounded-md'>Logout</div>
                      </div>
                  </div>
                ) : 
                <Link href='/components/pages/signup'>
                  <div className='me-4 px-3 py-1 hover:cursor-pointer hover:bg-green-500 text-black bg-green-400 rounded-md'>SignUp</div>
                </Link>
                }
            </div>
          </div>
        </header>}
        {children}
            {/* &copy; {new Date().getFullYear()} PlantMS */}
        {!hideHeader && <footer>
          <div className="flex md:flex-row flex-col shadow-inner shadow-zinc-900 gap-5 justify-evenly bg-black text-white p-10">
                <div className="flex flex-col gap-2 md:w-2/5">
                  <Image src={logo} alt='Logo' width={120} height={100} />
                  <p className=" text-sm md:text-base dark:text-neutral-200">
                    Discover a world of lush greenery! Shop a variety of plants, pots, and gardening essentials to bring nature into your home. Whether you're a seasoned gardener or just starting, we have everything you need to nurture your green space. 🌿✨
                    </p>
                    <div className="flex gap-2 mt-4">
                        <Image src={facebook} alt='Github' width={32} height={32}/>
                        <Image src={linkedin} alt='Linkedin' width={32} height={32} />
                        <Image src={instagram} alt='Instagram' width={32} height={32} />
                        <Image src={google} alt='Instagram' width={32} height={32} />
                    </div>
                </div>
                <div className="flex flex-col gap-1 justify-center items-center text-sm">
                  <div className="text-xl text-slate-500 font-bold ">Category</div>
                  <div>Gardening</div>
                  <div>Plants</div>
                  <div>Seeds</div>
                  <div>Bulbs</div>
                  <div>Planters</div>
                  <div>Soil & Fertilizer</div>
                  <div>Gifts</div>
                  <div>Pebbles</div>
                  <div>Accessories</div>
                </div>
                <div className="flex flex-col gap-1 items-center text-sm">
                  <div className="text-xl text-slate-500 font-bold ">Activity</div>
                  <div>Blogs</div>
                  <div>Articles</div>
                  <div>Decoration</div>
                  <div>Videos</div>
                </div>
                <div className="flex flex-col gap-1 items-center text-sm">
                  <div className="text-xl text-slate-500 font-bold ">Subscribe</div>
                  <div>Join us to receive gardening tips,<br /> offers, news & more</div>
                  <a href="/components/pages/signup">
                    <button className="w-full py-2 px-10 text-sm text-white bg-green-500 hover:bg-green-400 rounded-md">Subscribe</button>
                  </a>
                </div>
          </div>
        </footer>}
      </body>
    </html>
  );
}
