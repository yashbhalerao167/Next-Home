'use client';

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/bundle";
import { FaShareAlt, FaCheck } from "react-icons/fa";

SwiperCore.use([Navigation, Pagination, Autoplay]);

export default function ClientListingWrapper({ listing }: { listing: any }) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="relative group">
            <Swiper
                navigation
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                className="h-[60vh] md:h-[70vh] w-full"
            >
                {listing.imageURL.map((url: string) => (
                    <SwiperSlide key={url}>
                        <div
                            className="h-full w-full"
                            style={{
                                background: `url(${url}) center no-repeat`,
                                backgroundSize: "cover",
                            }}
                        >
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-500" />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="absolute bottom-10 right-10 z-20 flex flex-col gap-4">
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                    }}
                    className={`h-14 w-14 rounded-2xl flex justify-center items-center shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${copied
                            ? "bg-green-500 text-white"
                            : "glass text-primary hover:bg-white"
                        }`}
                >
                    {copied ? <FaCheck size={20} /> : <FaShareAlt size={22} />}
                    {copied && (
                        <span className="absolute -top-12 right-0 glass px-4 py-2 rounded-xl text-xs font-bold text-primary animate-fade-in whitespace-nowrap">
                            Copied to clipboard!
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
