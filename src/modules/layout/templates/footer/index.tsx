"use client"
import React, { useState } from "react"
import { ChevronLeft, ChevronRight, Star, ThumbsUp } from "lucide-react"

const Product = () => {
  const [quantity, setQuantity] = useState(2)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [aromaSlide, setAromaSlide] = useState(0)

  // Product images array for the main product
  const productImages = [
    "/Images/GPT.png",
    "/Images/product1.png",
    "/Images/product2.png",
  ]

  // Custom styles for exact font specifications
  const fontStyles = {
    bannerHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: "45px",
      letterSpacing: "5px",
      color: "#4f5864",
    },
    subCopy: {
      fontFamily: '"DIN Arabic Regular"',
      fontSize: "16px",
      letterSpacing: "1px",
      color: "#626262",
    },
    reviewerNama: {
      fontFamily: '"font-dinBold"',
      fontSize: "20px",
      letterSpacing: "1px",
      color: "#403F3F",
    },
    reviews: {
      fontFamily: '"DIN Arabic Regular"',
      fontSize: "15px",
      letterSpacing: "1px",
      color: "#403F3F",
    },
    crushed: {
      fontFamily: '"DIN Arabic Regular"',
      fontSize: "19px",
      letterSpacing: "1px",
      color: "#403F3F",
    },
    storyHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: "28px",
      letterSpacing: "5px",
      color: "#626262",
    },
    boxText: {
      fontFamily: '"DIN Next LT Arabic Light"',
      fontSize: "28px",
      color: "#403F3F",
    },
    subsequentHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: "22px",
      letterSpacing: "2px",
      color: "#626262",
    },
    description: {
      fontFamily: '"DIN Next LT Arabic Light"',
      fontSize: "12.12px",
      color: "#a28b6f",
      letterSpacing: "1px",
    },
    price: {
      fontSize: "52px",
      color: "#626262",
    },
    perfectForHeading: {
      fontFamily: '"American Typewriter"',
      fontSize: "26px",
      letterSpacing: "5px",
      color: "#626262",
    },
    button: {
      fontFamily: '"DIN Next LT Arabic Light"',
      fontSize: "20px",
    },
  }

  const products = [
    {
      name: "FLORAL SPICE",
      price: "$20",
      description: "Delicate blooms, lingering charm.",
      image: "/Images/product1.png",
    },
    {
      name: "CEDAR BLOOM",
      price: "$20",
      description: "Grounded in earth. Glowing with soul.",
      image: "/Images/product2.png",
    },
    {
      name: "WATER & WOOD",
      price: "$20",
      description: "Fresh as the tide. Calm as dusk.",
      image: "/Images/product3.png",
    },
    {
      name: "OCEAN BREEZE",
      price: "$25",
      description: "Salt air and endless horizons.",
      image: "/Images/product1.png",
    },
    // {
    //   name: "MOUNTAIN MIST",
    //   price: "$25",
    //   description: "Cool peaks and morning dew.",
    //   image: "/Images/product2.png",
    // },
    // {
    //   name: "SUNSET GLOW",
    //   price: "$25",
    //   description: "Warm amber and golden light.",
    //   image: "/Images/product3.png",
    // },
  ]

  const reviews = [
    {
      name: "Priya M.",
      rating: 5,
      review:
        "Smells like a fresh forest walk - clean, calming, and not overpowering.",
      recommends: true,
    },
    {
      name: "Aditi R.",
      rating: 5,
      review:
        "The scent fills the room without being too strong. My new favorite!",
      recommends: true,
    },
    {
      name: "Sara L.",
      rating: 5,
      review:
        "Crushed Pine feels like nature in a jar. Perfect for cozy evenings.",
      recommends: true,
    },
  ]

  const nextImage = () => {
    setCurrentSlide((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + productImages.length) % productImages.length
    )
  }

  const nextAroma = () => {
    // Simple approach: limit to showing 2 products at most in the last slide
    const maxSlide = products.length - 2

    if (aromaSlide < maxSlide) {
      setAromaSlide(aromaSlide + 1)
    }
  }

  const prevAroma = () => {
    if (aromaSlide > 0) {
      setAromaSlide(aromaSlide - 1)
    }
  }
  return (
    <div className="p-0 bg-[#e2e2d8]">
      {/* First Section - Product Details */}
      <div className="flex items-center">
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Left Side - Product Info */}
            <div className="space-y-8 py-16 border-b-[2px] border-[#a3a37f]/30 ">
              <div className="px-12">
                <h1
                  style={{
                    ...fontStyles.bannerHeading,
                    lineHeight: "1.2",
                  }}
                  className="my-10"
                >
                  CEDAR BLOOM
                </h1>

                <div className="space-y-6">
                  <div>
                    {/* <h3 style={fontStyles.description}>DESCRIPTION</h3> */}
                    <p
                      style={{
                        ...fontStyles.subCopy,
                        lineHeight: "1.8",
                      }}
                    >
                      Inspired by the grounding aroma of a woodland trail, Cedar
                      <br />
                      Bloom is an earthy, botanical escape into nature's calm —
                      <br />
                      poured in soy wax and designed to burn slow.
                    </p>
                    <p
                      style={{
                        ...fontStyles.subCopy,
                        lineHeight: "1.8",
                        marginTop: "16px",
                        marginBottom: "8px",
                      }}
                      className="pb-4"
                    >
                      Hand-poured in small batches. Up to 40 hours of burn time.
                    </p>
                  </div>
                </div>
              </div>
              {/* Line */}
              <div className="w-full h-[2px] bg-[#b9a893] opacity-[22%] mt-10"></div>

              <div className="space-y-4 px-12 py-3">
                <div>
                  {/* <h3 style={fontStyles.description}>PRICE</h3> */}
                  <p className="font-dinBold" style={fontStyles.price}>
                    $49
                  </p>
                </div>

                <div>
                  <h3 style={fontStyles.description}>QUANTITY</h3>
                  <div className="flex items-center space-x-4 my-2">
                    <select
                      className="border-none bg-white px-[40px] py-[8px] text-gray-700 text-sm focus:outline-none appearance-none"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: "left 12px center", 
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "16px",
                        paddingLeft: "40px", 
                        paddingRight: "40px", 
                      }}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </select>

                    <button className="bg-[#535c4a] text-white px-8 md:px-10 py-2 md:py-2 text-sm md:text-md font-medium rounded-none font-din">
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
              {/* Line */}
              <div className="w-full h-[2px] bg-[#a3a37f] opacity-[30%]"></div>
              <div className="pt-4 px-12 py-3">
                <h3 style={fontStyles.description} className="py-2">
                  FRAGRANCE PROFILE
                </h3>
                <div className="space-y-2 my-2">
                  <p style={fontStyles.subCopy} className="">
                    <span className="font-bold font-dinBold text-[14px]">
                      Top Note:
                    </span>{" "}
                    Fresh Pine
                  </p>
                  <p style={fontStyles.subCopy}>
                    <span className="font-bold font-dinBold text-[14px]">
                      Heart Note:
                    </span>{" "}
                    Resinous Balsam
                  </p>
                  <p style={fontStyles.subCopy}>
                    <span className="font-bold font-dinBold text-[14px]">
                      Base Note:
                    </span>{" "}
                    Grounded Cedarwood
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Product Image */}
            <div
              className="flex justify-center relative w-full pt-10"
              style={{ backgroundImage: "url('/Images/Background.png')" }}
            >
              <div className="relative">
                <button
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-32 hover:scale-110 transition-transform"
                  onClick={prevImage}
                >
                  <ChevronLeft size={40} />
                </button>
                <div className="w-full flex items-center justify-center">
                  <img
                    src={productImages[currentSlide]}
                    alt="Product"
                    className="w-[350px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <img src="/Images/Shadow.png" alt="Shadow" className="w-full h-auto"/>
                <button
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-32 hover:scale-110 transition-transform"
                  onClick={nextImage}
                >
                  <ChevronRight size={40} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Section - Perfect For */}
      <div className="py-20">
        <div className="w-full">
          <h2 className="text-center" style={fontStyles.perfectForHeading}>
            PERFECT FOR
          </h2>

          <div className="flex flex-col md:flex-row justify-between px-6 py-8 gap-8 md:gap-0">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto">
                <img src="/Images/chat.svg" alt="chat" />
              </div>
              <p
                style={{
                  ...fontStyles.subCopy,
                  textAlign: "center",
                  lineHeight: "1.8",
                }}
              >
                Long conversations, slow
                <br />
                music, or time alone.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto ">
                <img src="/Images/Love.svg" alt="Love" />
              </div>
              <p
                style={{
                  ...fontStyles.subCopy,
                  textAlign: "center",
                  lineHeight: "1.8",
                }}
              >
                Cozy evenings, soft light,
                <br />
                and slow rituals.
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto">
                <img src="/Images/gift-box.svg" alt="" />
              </div>
              <p
                style={{
                  ...fontStyles.subCopy,
                  textAlign: "center",
                  lineHeight: "1.8",
                }}
              >
                A housewarming, a birthday,
                <br />
                or simply because.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Third Section - A Forest Reborn */}
      <div className="">
        <div className="w-full mx-auto">
          {/* 1 column on small screens, 55% / 45% on lg+ */}
          <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] items-center">
            {/* Left - Image (55%) */}
            <div className="relative">
              <img
                src="/Images/Jardinbotanic.jpg"
                alt="Image"
                className="w-full h-[500px] object-cover"
              />
            </div>

            {/* Right - Text (45%) */}
            <div className="space-y-6 bg-[#C5C8B3] w-full h-full pl-6 lg:pl-20 pt-12">
              <h2 style={fontStyles.subsequentHeading} className="px-2">
                A FOREST REBORN
              </h2>
              <p
                style={{ ...fontStyles.subCopy, lineHeight: "1.8" }}
                className="pl-2 pr-8 "
              >
                Crushed Pine by Jardin Botanica evokes the quiet majesty of
                mist-covered evergreens after winter rain. It is a scent of
                awakening—the snap of pine needles beneath your feet, the crisp
                bite of cedar carried on the wind, and the meditative warmth of
                balsam deep in the trees. Rooted and restorative, this candle
                celebrates the enduring spirit of nature.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Forth Section */}
      <div className="py-40 overflow-hidden">
        <div className="max-w-8xl mx-auto pl-8">
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-60">
            {/* Left Side - Heading */}
            <div
              className={`flex-shrink-0 w-full lg:w-96 transition-all duration-500 ease-in-out ${
                aromaSlide > 0
                  ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                  : "lg:opacity-100 lg:w-96"
              }`}
            >
              <h2
                style={{
                  ...fontStyles.subsequentHeading,
                  fontSize: "22px",
                  lineHeight: "1.3",
                  marginBottom: "16px",
                  whiteSpace: "nowrap",
                }}
              >
                OTHER AROMAS WORTH LIGHTING
              </h2>
              <p
                style={{
                  ...fontStyles.subCopy,
                  fontSize: "18px",
                  lineHeight: "1.5",
                }}
                className="text-right"
              >
                
                Because one scent is never enough
              </p>
            </div>

            {/* Right Side - Product Cards with Arrows */}
            <div
              className={`flex-1 relative overflow-hidden transition-all duration-900 ease-in-out ${
                aromaSlide > 0 ? "lg:ml-0" : ""
              }`}
            >
              {/* Left Arrow */}
              {aromaSlide > 0 && (
                <button
                  className="absolute left-6 top-[40%] transform -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-[#535c4a] hover:bg-gray-700 transition-colors flex items-center justify-center"
                  onClick={prevAroma}
                >
                  <ChevronLeft size={24} className="text-white" />
                </button>
              )}

              {/* Product Cards Container */}
              <div className="relative">
                <div
                  className={`flex gap-4 transition-transform duration-800 ease-in-out ${
                    aromaSlide > 0 ? "justify-end" : "justify-start"
                  }`}
                  style={{
                    transform: `translateX(-${aromaSlide * (240 + 16)}px)`,
                    width: "max-content",
                    minWidth: "100%",
                  }}
                >
                  {products.map((product, index) => (
                    <div key={index} className="flex-shrink-0 w-60">
                      {" "}
                     
                      {/* Product Image */}
                      <div className="w-full h-[310px] mb-6 overflow-hidden">
                        {" "}
                        {/* Increased from h-72 to h-80 */}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-800"
                        />
                      </div>
                      {/* Product Info Below Image */}
                      <div className="flex justify-between items-start">
                        {/* Left: Name and Description */}
                        <div className="flex-1 pr-2">
                          {" "}
                         
                          <h3
                            style={{
                              ...fontStyles.subsequentHeading,
                              fontSize: "15px", 
                              letterSpacing: "1.5px", 
                              marginBottom: "6px", 
                              lineHeight: "1.2",
                            }}
                          >
                            {product.name}
                          </h3>
                          <p
                            style={{
                              ...fontStyles.subCopy,
                              fontSize: "13px", 
                              lineHeight: "1.3", 
                              letterSpacing: "0.3px", 
                            }}
                          >
                            {product.description}
                          </p>
                        </div>

                        {/* Right: Price */}
                        {/* <div className="flex-shrink-0">
                          <p
                            style={{
                              ...fontStyles.price,
                              fontSize: "22px", 
                            }}
                            className="font-dinBold"
                          >
                            {product.price}
                          </p>
                        </div> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              {aromaSlide < products.length - 2 && (
                <button
                  className="absolute right-6 top-[40%] transform -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-[#535c4a] hover:bg-gray-700 transition-colors flex items-center justify-center"
                  onClick={nextAroma}
                >
                  <ChevronRight size={24} className="text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fifth Section - Customer Reviews */}
      <div className="">
        <div className="w-full px-6 md:px-12">
          {" "}
          {/* added equal padding */}
          <h2
            style={{
              ...fontStyles.subsequentHeading,
              textAlign: "center",
            }}
          >
            LOVED BY OUR CUSTOMERS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-28 my-8">
            {reviews.map((review, index) => (
              <div key={index} className="">
                {" "}
                {/* increased inner spacing too */}
                <div className="flex items-center gap-2">
                  <h4 style={fontStyles.reviewerNama}>{review.name}</h4>
                  <img src="/Images/tick.svg" alt="tick" className="w-5 h-5"/>
                </div>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-current text-[#535c4a] pt-[4px]"
                    />
                  ))}
                </div>
                <p
                  style={{
                    ...fontStyles.reviews,
                    lineHeight: "1.6",
                  }}
                  className="pt-3"
                >
                  {review.review}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sixth Section - Newsletter */}
      <div className="py-12 md:py-28 px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-[22px] font-normal text-black opacity-[50%] mb-1 md:mb-1 tracking-wide font-typewriter">
            JOIN OUR NEWSLETTER
          </h2>

          <p className="text-base md:text-[16px] text-black leading-[1.4] font-din tracking-widest mb-3">
            Be the first to know our special offers for you
          </p>

          <div className="flex flex-col md:flex-row max-w-lg mx-auto gap-4 md:gap-0">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 md:px-6 py-3 md:py-1 focus:outline-none focus:border-gray-500 text-gray-700 font-din"
            />
            <button className="bg-[#535c4a] text-white px-8 md:px-10 py-2 md:py-1 text-sm md:text-md font-medium rounded-none font-din">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white py-12 md:py-16 px-4 md:px-12">
        <div className="">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Logo - Centered on mobile */}
            <div className="col-span-1 mt-10 flex justify-center md:justify-start">
              <div className="text-white">
                <img
                  src="/Images/Jardinlogo.png"
                  alt="JardinLogo"
                  className="w-48"
                />
              </div>
            </div>

            {/* About Us */}
            <div className="text-center md:text-left">
              <h3 className="text-white mb-4 tracking-wider font-din font-bold">
                ABOUT US
              </h3>
              <ul className="space-y-2 text-gray-400 font-din">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    The Lab
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Journal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Shop */}
            <div className="text-center md:text-left">
              <h3 className="text-white mb-4 tracking-wider font-din font-bold">
                SHOP
              </h3>
              <ul className="space-y-2 text-gray-400 font-din">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Hand
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home Creations
                  </a>
                </li>
              </ul>
            </div>

            {/* Orders and Support */}
            <div className="text-center md:text-left">
              <h3 className="text-white mb-4 tracking-wider font-din font-bold">
                ORDERS AND SUPPORT
              </h3>
              <ul className="space-y-2 text-gray-400 font-din">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Order History
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Track Your Order
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help & FAQs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="text-center md:text-left">
              <h3 className="text-white mb-4 tracking-wider font-din font-bold">
                FOLLOW US
              </h3>
              <ul className="space-y-2 text-gray-400 font-din">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-center md:justify-between items-center mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-800 gap-4 md:gap-0">
            <p className="text-gray-400 text-sm font-din text-center md:text-left">
              © 2025, Jardin Botanica. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Product