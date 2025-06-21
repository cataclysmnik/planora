"use client";

import Aurora from "../src/blocks/Backgrounds/Aurora/Aurora";
import DotGrid from "../src/blocks/Backgrounds/DotGrid/DotGrid";
import RotatingText from "../src/blocks/TextAnimations/RotatingText/RotatingText";


export default function Home() {
  return (
    <div className="w-full h-full">
      <Aurora
        colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <DotGrid
        dotSize={10}
        gap={15}
        baseColor="#FFFFFF"
        activeColor="#5227FF"
        proximity={120}
        shockRadius={250}
        shockStrength={5}
        resistance={750}
        returnDuration={1.5}
      />
      <section className="flex flex-col ml-36 mt-36">
        <div className="flex flex-row align-middle items-center">
          <h1 className="text-7xl font-bold">Planning Trips made</h1>
          <RotatingText
            texts={['Easy!', 'Fast!', 'Efficient!', 'Cool!']}
            mainClassName="ml-2 px-4 sm:px-2 md:px-3 pb-10 text-purple-400 overflow-hidden text-7xl font-bold py-0.5 sm:py-1 md:py-2 justify-center"
            staggerFrom={"first"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-120%" }}
            staggerDuration={0.025}
            splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2000}
          />
        </div>
        <p className="mt-4 text-2xl">
          With Planora, planning your trips has never been easier and more efficient.
        </p>
      </section>
    </div>
  );
}
