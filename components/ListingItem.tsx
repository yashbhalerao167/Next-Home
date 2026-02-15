import Link from "next/link";
import { MdLocationOn, MdKingBed, MdBathtub } from "react-icons/md";

export default function ListingItem({ listing }: { listing: any }) {
    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-premium transition-all duration-500 w-full sm:w-[320px] border border-slate-100/50 hover:-translate-y-2">
            <Link href={`/listing/${listing._id}`} className="block relative">
                <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                        src={listing.imageURL[0] || "https://premiumpreviews.com/wp-content/uploads/2021/01/Real-Estate-House-Image-Placeholder.jpg"}
                        alt={listing.name}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {listing.offer && (
                        <div className="absolute top-4 left-4 bg-accent text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                            Special Offer
                        </div>
                    )}

                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                    </div>
                </div>

                <div className="p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-outfit font-bold text-primary group-hover:text-secondary transition-colors truncate">
                            {listing.name}
                        </h3>
                        <div className="flex items-center gap-1 text-text-muted">
                            <MdLocationOn className="text-secondary shrink-0" size={16} />
                            <p className="text-sm truncate">{listing.address}</p>
                        </div>
                    </div>

                    <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                        {listing.description}
                    </p>

                    <div className="flex items-center gap-4 py-2 border-y border-slate-50">
                        <div className="flex items-center gap-1.5 text-text-muted">
                            <MdKingBed className="text-secondary" size={18} />
                            <span className="text-xs font-semibold">{listing.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-muted">
                            <MdBathtub className="text-secondary" size={18} />
                            <span className="text-xs font-semibold">{listing.bathrooms} Baths</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <p className="text-secondary font-outfit font-bold text-xl">
                            <span className="text-sm font-medium mr-0.5">₹</span>
                            {listing.offer
                                ? (listing.discountedPrice || 0).toLocaleString("en-IN")
                                : (listing.regularPrice || 0).toLocaleString("en-IN")}
                            {listing.type === "rent" && <span className="text-xs text-text-muted font-normal"> / month</span>}
                        </p>

                        <div className="text-secondary text-xs font-bold uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            View Details →
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
