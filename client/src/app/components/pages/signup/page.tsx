"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import background1 from '/public/images/login.jpg';
import logo from '/public/images/logo2.png';
import { BackgroundGradientAnimation } from '../../ui/background-gradient-animation';
import { useRouter } from 'next/navigation';

export default function page() {

    const [isSignUp, setIsSignUp] = useState(true);
    const router = useRouter()
    const handleToggle = () => {
        setIsSignUp(!isSignUp);
    }

    const [signUpData, setSignUpData] = useState({
        name : "",
        email : "",
        password : "",
        role : ""
    });

    const [loginData, setLoginData] = useState({
        email : "",
        password : ""
    });

    const handleSignUp = async () => {
        console.log(signUpData);
        
        const response = await fetch("/api/admin/signup", 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpData)
            }
        )

        if(response.status === 200) {
            alert("Sign up successful!");
            setSignUpData({
                name : "",
                email : "",
                password : "",
                role : ""
            });
            handleToggle();
        } else {
            alert("Error while signing up!");
        }
    }

    const handleLogin = async () => {
        const response = await fetch("/api/admin/login", 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            }
        )
        
        if(response.status === 200) {
            const data = await response.json();
            document.cookie = `token=${data.token}; expires=${new Date(Date.now() + 60 * 60 * 1000 * 24 * 30).toUTCString()}`;
            alert("Login successful!");
            setLoginData({
                email : "",
                password : ""
            });

            router.push("/")
        } else {
            alert("Invalid credentials!");
        }
    }


  return (
    <div className='h-screen w-screen'>
        <BackgroundGradientAnimation>
            <Image src={background1} alt='' className='h-screen w-screen opacity-15 absolute' ></Image>
            <div className='h-screen w-screen bg-black opacity-80 absolute'></div>
            <div className='absolute form z-50 flex w-full justify-center items-center h-full'>
                { isSignUp ? 
                    <div className='flex justify-center items-center m-5 w-2/3 h-3/5 drop-shadow-md backdrop-blur-2xl'>
                        <div className='flex justify-center items-center flex-col gap-1 w-1/2 h-full' style={{ backgroundColor: "#02321D" }}>
                            <Image src={logo} alt='' className='h-20 w-40'></Image>
                            <div className='text-4xl mb-2 '>Hello, mate!!!</div>
                            <div className='text-base'>Already have an account ?</div>
                            <button onClick={handleToggle} className='text-white font-semibold px-8 py-2 rounded-full border hover:bg-white hover:text-green-900'>Log In</button>
                        </div>
                        <div className='flex justify-center items-center flex-col gap-6 w-1/2'>
                            <div className='text-4xl'>Sign Up</div>
                            <div className='flex flex-col text-white gap-2 w-3/5'>
                                <input type='text' placeholder='Name' className='bg-transparent border indent-2 py-2 rounded-md' value={signUpData.name} onChange={(e) => setSignUpData({...signUpData, name : e.target.value})} />
                                <input type='email' placeholder='Email' className='bg-transparent border indent-2 py-2 rounded-md' value={signUpData.email} onChange={(e) => setSignUpData({...signUpData, email : e.target.value})} />
                                <input type='password' placeholder='Password' className='bg-transparent border indent-2 py-2 rounded-md' value={signUpData.password} onChange={(e) => setSignUpData({...signUpData, password : e.target.value})} />
                                <select value={signUpData.role} onChange={(e) => setSignUpData({...signUpData, role : e.target.value})} className='bg-transparent selection:bg-transparent border indent-2 py-2 rounded-md'>
                                    <option value='' disabled  className='text-black'>Select Role</option>
                                    <option value='admin' className='text-black'>admin</option>
                                    <option value='customer' className='text-black'>customer</option>
                                </select>
                                <button onClick={() => handleSignUp()} className='text-white font-semibold px-10 py-2 rounded-md bg-green-800 hover:bg-green-900 mt-5'>Sign Up</button>
                            </div>
                        </div>
                    </div> : 
                        <div className='flex justify-center items-center m-5 w-2/3 h-3/5 drop-shadow-md backdrop-blur-2xl'>
                            <div className='flex justify-center items-center flex-col gap-6 w-1/2'>
                                <div className='text-4xl'>Log In</div>
                                <div className='flex flex-col text-white gap-2 w-3/5'>
                                    <input type='email' placeholder='Email' className='bg-transparent border indent-2 py-2 rounded-md' value={loginData.email} onChange={(e) => setLoginData({...loginData, email : e.target.value})} />
                                    <input type='password' placeholder='Password' className='bg-transparent border indent-2 py-2 rounded-md' value={loginData.password} onChange={(e) => setLoginData({...loginData, password : e.target.value})} />
                                    <button onClick={() => handleLogin()} className='text-white font-semibold px-10 py-2 rounded-md bg-green-800 hover:bg-green-900 mt-5'>Log In</button>
                                </div>
                            </div>
                            <div className='flex justify-center items-center flex-col gap-1 w-1/2 h-full' style={{ backgroundColor: "#02321D" }}>
                                <Image src={logo} alt='' className='h-20 w-40'></Image>
                                <div className='text-4xl mb-2 '>Hello, mate!!!</div>
                                <div className='text-base'>Don't have an account ?</div>
                                <button onClick={handleToggle} className='text-white font-semibold px-8 py-2 rounded-full border hover:bg-white hover:text-green-900'>Sign up</button>
                            </div>
                        </div> }
            </div>
        </BackgroundGradientAnimation>
    </div>
  )
}
