"use client";
import { useEffect, useState } from "react";
import { HeroParallax } from "./components/ui/hero-parallax";
import Image from "next/image";
import SignUp from "/public/images/SignUp.png";
import LogIn from "/public/images/LogIn.png";
import image1 from "/public/images/bg.jpg"
import image2 from "/public/images/bg2.png"
import image3 from "/public/images/item2.jpg"
import image5 from "/public/images/bonsai.jpg"
import image6 from "/public/images/item1.webp"


export default function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setUserData(data.data);
        } else {
          setUserData(null);
        }
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <HeroParallax products={products}></HeroParallax>
    </div>
  );
}

export const products = [
  {
    title: "LogIn",
    link: "https://gomoonbeam.com",
    thumbnail:
      LogIn,
  },
  {
    title: "SignIn",
    link: "https://cursor.so",
    thumbnail:
      SignUp,
  },
  {
    title: "LogIn",
    link: "https://gomoonbeam.com",
    thumbnail:
      image1,
  },
  {
    title: "SignIn",
    link: "https://cursor.so",
    thumbnail:
      image2,
  },
  {
    title: "LogIn",
    link: "https://gomoonbeam.com",
    thumbnail:
      image3,
  },
  {
    title: "SignIn",
    link: "https://cursor.so",
    thumbnail:
      image5,
  },
  {
    title: "LogIn",
    link: "https://gomoonbeam.com",
    thumbnail:
      image6,
  },
  {
    title: "SignIn",
    link: "https://cursor.so",
    thumbnail:
      SignUp,
  },
  {
    title: "LogIn",
    link: "https://gomoonbeam.com",
    thumbnail:
      LogIn,
  },
];