'use client';

import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

SwiperCore.use([Navigation]);

export default function HomeSwiper({ listings }: { listings: any[] }) {
    return (
        <Swiper navigation>
            {listings &&
                listings.length > 0 &&
                listings.map((listing) => (
                    <SwiperSlide key={listing._id}>
                        <div
                            className="h-[500px]"
                            style={{
                                background: `url(${listing.imageURL[0]}) center no-repeat`,
                                backgroundSize: "cover",
                            }}
                        ></div>
                    </SwiperSlide>
                ))}
        </Swiper>
    );
}
