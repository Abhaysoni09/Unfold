import { useState, useEffect } from "react";
import img1 from "../assets/BBC Travel, 2026'da görülmesi gereken destinasyonları açıkladı.jpeg"
import img2 from "../assets/Voyage en avion _ 7 articles indispensables dans le bagage cabine.jpeg"
import img3 from "../assets/Sunset hiking adventure.jpeg"

function ImageScroller() {
  const images = [
    img1,
    img2,
    img3,
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex h-120 justify-center items-center">
      <div className="w-400 h-110 overflow-hidden rounded-lg">
        <div
          className="flex h-full transition-transform duration-700"
          style={{
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className="w-full h-full object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImageScroller