"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import SignUp from "/public/images/SignUp.png";
import LogIn from "/public/images/LogIn.png";
import image1 from "/public/images/bg.jpg"
import image2 from "/public/images/bg2.png"
import image3 from "/public/images/item2.jpg"
import { Carousel } from "./components/ui/carousel";
import { motion } from "framer-motion";
import { InfiniteMovingCards } from "./components/ui/infinite-moving-cards";
export default function Home() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchProducts = async () => {
    const response = await fetch("/api/products");
    const data = await response.json();
    if (data.status === 200) {
      setAllProducts(data.body);
    } else {
      console.error("Failed to fetch products", data.message);
    }
  }

  const slideData = [
    {
      title: "Happiness Plant",
      src: "https://www.apkainterior.com/blog/wp-content/uploads/2022/03/Blog-Header-Banner-Planter-Stand.jpg",
    },
    {
      title: "People admire",
      src: "https://heyhorti.com/cdn/shop/files/horti-banner_3396009e-30d2-48f0-b667-2e4d9816adb7_1000x.jpg?v=1724355527",
    },
    {
      title: "Go Green ",
      src: "https://www.topsdaynurseries.co.uk/wp-content/uploads/2024/01/11-1.png",
    },
    {
      title: "Plant day",
      src: "https://urbanplants.co.in/cdn/shop/collections/plants-673803.png?v=1689753524",
    },
    {
      title: "Plant care",
      src: "https://abanahomes.com/wp-content/uploads/2023/02/cheap-indoor-plants.jpeg",
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const categories = ["All", ...new Set(allProducts.map((p) => p.main_category))];

  const filteredProducts = selectedCategory === "All" 
    ? allProducts 
    : allProducts.filter((product) => product.main_category === selectedCategory);

    const displayedProducts = filteredProducts.slice(0, 12);

  const trendingProducts = allProducts.filter((product) => product.sub_category === "Trending");
  const trendingProduct = trendingProducts.map((product) => (
    <motion.div 
      key={product.id} 
      className="flex flex-col gap-3 p-4 rounded-xl items-center 
                bg-zinc-900/80 shadow-lg shadow-black/50 hover:scale-105 
                transition-transform duration-300 ease-in-out"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <img 
        src={product.image} 
        alt={product.name} 
        width={300} 
        height={300} 
        className="rounded-lg hover:scale-105 transition-transform duration-300"
      />
      <h2 className="text-xl font-semibold text-white">{product.name}</h2>
      <p className="text-green-400 text-lg font-medium">$ {product.price}</p>
    </motion.div>
  ));

  const under500 = allProducts.filter((product) => product.price < 500);
  const under500Product = under500.map((product) => (
    <motion.div 
      key={product.id} 
      className="flex flex-col justify-between gap-3 p-4 rounded-xl  items-center 
                bg-zinc-900/80 shadow-lg shadow-black/50 hover:scale-105
                transition-transform duration-300 ease-in-out "
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="flex flex-col gap-3 items-center">
        <img 
          src={product.image} 
          alt={product.name} 
          width={300} 
          height={300} 
          className="rounded-lg hover:scale-105 transition-transform duration-300"
        />
        <h2 className="text-xl font-semibold text-white text-wrap w-60">{product.name}</h2>
        <p className="text-green-400 text-lg font-medium">$ {product.price}</p>
      </div>
      <a href={'/components/pages/home/' + product._id}>
        <button className="bg-zinc-300 text-black px-10 py-2 rounded-xl hover:bg-zinc-400">
          View
        </button>
      </a>
    </motion.div>
  ));


  return (
    <div className="flex flex-col gap-10 py-6 justify-center items-center">
    <motion.div 
      className="flex justify-center text-center text-3xl md:text-5xl text-zinc-400 bg-black relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="font-semibold tracking-wide">
        Deep Dive Into World Of &nbsp;
        <motion.span 
          className="text-green-600 font-bold"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Fresh Air
        </motion.span>
      </h1>
    </motion.div>

    <div className="relative overflow-hidden w-full h-full py-5">
      <Carousel slides={slideData} />
    </div>

    <div className="flex flex-col gap-10 mt-10 justify-center items-center w-full">
      <motion.div 
        className="flex justify-center text-center text-3xl md:text-5xl text-zinc-400 bg-black relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="font-semibold tracking-wide">Explore Our Collection</h1>
      </motion.div>

      <div className="flex justify-center items-center gap-4">
        <label className="text-white text-lg">Filter by Category:</label>
        <select
          className="px-4 py-2 bg-zinc-800 text-white rounded-md border border-zinc-600"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4 md:w-4/5">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <motion.div 
              key={product.id} 
              className="flex justify-between flex-col gap-3 p-4 rounded-xl items-center 
                        bg-zinc-900/80 shadow-lg shadow-black/50 hover:scale-105 
                        transition-transform duration-300 ease-in-out"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="flex flex-col gap-3">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  width={200} 
                  height={200} 
                  className="rounded-lg hover:scale-105 transition-transform duration-300"
                />
                <h2 className="text-xl font-semibold text-white">{product.name}</h2>
                <p className="text-green-400 text-lg font-medium">$ {product.price}</p>
              </div>
              <a href={'/components/pages/home/' + product._id}>
                <button className="bg-zinc-300 text-black px-6 py-2 rounded-xl hover:bg-zinc-400">
                  View
                </button>
              </a>
            </motion.div>
          ))
        ) : (
          <p className="text-white text-lg col-span-2 md:col-span-5 text-center">
            No products found.
          </p>
        )}
      </div>
    </div>

    <motion.div 
      className="flex justify-center text-center text-3xl md:text-5xl text-zinc-400 bg-black relative"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-semibold tracking-wide mt-10">Trending Items</h1>
    </motion.div>

    <div className="flex justify-center items-center md:w-4/5 w-full">
      <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
        {trendingProduct}
      </div>
    </div>

    <motion.div 
      className="flex justify-center text-center text-3xl md:text-5xl text-zinc-400 bg-black relative"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-semibold tracking-wide mt-10">Under 499 $</h1>
    </motion.div>

    <div className="flex justify-center items-center md:w-4/5 w-full">
      <div 
        className="flex gap-4 overflow-x-auto scroll-smooth whitespace-nowrap p-4 w-full"
      >
        {under500Product}
      </div>
    </div>

    <motion.div 
      className="flex justify-center text-center text-3xl md:text-5xl text-zinc-400 bg-black relative"
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="font-semibold tracking-wide mt-10">Gallary</h1>
    </motion.div>

    <div className="max-w-[80%] justify-center items-center mx-auto flex flex-col gap-5">
      <div className="flex gap-4 w-full items-center">
        <iframe
          width="100%"
          height="300px"
          src="https://www.youtube.com/embed/w77zPAtVTuI?si=yi6BeeYTSkhP1Vp4"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <iframe
          width="100%"
          height="300px"
          src="https://www.youtube.com/embed/x5mHzwEOpp4?si=yN3vPKGJnMqHrvrC"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex gap-4 w-full">
        <iframe
          width="100%"
          height="200px"
          src="https://www.youtube.com/embed/80krXQxfeog?si=SmpDOn9sIyNzKeQq"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <iframe
          width="100%"
          height="200px"
          src="https://www.youtube.com/embed/uSOOO3KBKDY?si=LDR1I-uE-62_mfBI"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <iframe
          width="100%"
          height="200px"
          src="https://www.youtube.com/embed/FuWIYIGwh7s?si=myv6L3HT2YIFuccq"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="flex gap-4 w-full">
        <iframe
          width="100%"
          height="200px"
          src="https://www.youtube.com/embed/lim-EKWFtTk?si=Kfdh57lfCY-e2TiE"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <iframe
          width="100%"
          height="200px"
          src="https://www.youtube.com/embed/LZhnCxG5c6s?si=QiSbkFML6dMxvSE7"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>

    

    <div className="h-[20rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </div>

  </div>
  );
}

const testimonials = [
  {
    quote:
      "“To forget how to dig the earth and tend the soil is to forget ourselves.”",
    name: "Mahatma Gandhi"
  },
  {
    quote:
      "“A garden is a complex of aesthetic and plastic intentions; and the plant is, to a landscape artist, not only a plant – rare, unusual, ordinary or doomed to disappearance – but it is also a color, a shape, a volume or an arabesque in itself.”",
    name: "Roberto Burle Marx",
  },
  {
    quote: "“If you think in terms of a year, plant a seed; if in terms of ten years, plant trees; if in terms of 100 years, teach the people.”",
    name: "Confucius",
  },
  {
    quote:
      "“My green thumb came only as a result of the mistakes I made while learning to see things from the plant’s point of view.”",
    name: "H. Fred Dale",
  },
  {
    quote:
      "“The secret of improved plant breeding, apart from scientific knowledge, is love.”",
    name: "Luther Burbank",
  },
];
