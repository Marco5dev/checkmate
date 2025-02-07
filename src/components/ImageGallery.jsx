"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const images = [
  { src: "/previews/preview1.png", alt: "Task Management View" },
  { src: "/previews/preview2.png", alt: "Notes and Documentation" },
  { src: "/previews/preview3.png", alt: "Theme Customization" },
];

export default function ImageGallery() {
  const [positions, setPositions] = useState([
    "center",
    "right",
    "left",
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        const newPositions = [...prev];
        const last = newPositions.pop();
        newPositions.unshift(last);
        return newPositions;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] perspective-1000">
      <div className="relative w-full h-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`
              absolute w-full h-full transition-all duration-500 ease-in-out
              ${getPositionStyles(positions[index])}
            `}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-contain md:object-cover rounded-lg shadow-xl"
              sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 550px"
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function getPositionStyles(position) {
  switch (position) {
    case "center":
      return `
        z-30 
        transform-none 
        opacity-100
      `;
    case "left":
      return `
        z-20 
        -translate-x-[20%] sm:-translate-x-[30%] 
        -translate-z-[100px] 
        opacity-70 
        scale-[0.85] sm:scale-90
      `;
    case "right":
      return `
        z-20 
        translate-x-[20%] sm:translate-x-[30%] 
        -translate-z-[100px] 
        opacity-70 
        scale-[0.85] sm:scale-90
      `;
    default:
      return "";
  }
}
