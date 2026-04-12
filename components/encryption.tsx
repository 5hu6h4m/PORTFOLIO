"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export function Encryption() {
  return (
    <div className="flex flex-col relative items-center justify-center py-20 w-full h-full overflow-hidden">
      <div className="absolute w-auto h-auto top-0 z-[5]">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[40px] font-medium text-center text-gray-200 uppercase tracking-tighter"
        >
          Performance
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            {" "}
            &{" "}
          </span>
          Security
        </motion.div>
      </div>

      <div className="flex flex-col items-center justify-center translate-y-[-50px] absolute z-[20] w-auto h-auto">
        <div className="flex flex-col items-center group cursor-pointer w-auto h-auto">
          <Image
            src="/LockTop.png"
            alt="Lock top"
            width={50}
            height={50}
            className="w-[50px] translate-y-5 transition-all duration-500 group-hover:translate-y-11"
          />
          <Image
            src="/LockMain.png"
            alt="Lock Main"
            width={70}
            height={70}
            className=" z-10"
          />
        </div>

        <div className="Welcome-box px-[15px] py-[4px] z-[20] border border-primary/20 my-[20px] bg-black/50 backdrop-blur-sm rounded-lg">
          <h1 className="text-primary text-[12px] font-mono tracking-widest uppercase">Encryption</h1>
        </div>
      </div>

      <div className="absolute z-[20] bottom-[30px] px-[5px]">
        <div className="font-mono text-[14px] font-medium text-center text-gray-400 uppercase tracking-[0.3em]">
          Secure your data with end-to-end encryption
        </div>
      </div>

      <div className="w-full flex items-start justify-center absolute">
        <video
          loop
          muted
          autoPlay
          playsInline
          preload="auto"
          className="w-full h-auto opacity-30 mix-blend-screen"
          src="/encryption.webm"
        />
      </div>
    </div>
  );
};
