import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { notFound } from "next/navigation";
import { FaBath, FaBed, FaChair, FaMapMarkerAlt, FaParking } from "react-icons/fa";
import Contact from "@/components/Contact";
import ClientListingWrapper from "@/components/ClientListingWrapper";

export const dynamic = "force-dynamic";

async function getListing(id: string) {
    await dbConnect();
    const listing = await Listing.findById(id);
    if (!listing) return null;
    return JSON.parse(JSON.stringify(listing));
}

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const listing = await getListing(id);

    if (!listing) {
        notFound();
    }

    return (
        <main className="pb-24 bg-background min-h-screen">
            <ClientListingWrapper listing={listing} />

            <div className="max-w-6xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                                {listing.type === "rent" ? "For Rent" : "For Sale"}
                            </span>
                            {listing.offer && (
                                <span className="bg-accent/10 text-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-accent/20">
                                    ₹{(listing.regularPrice - listing.discountedPrice).toLocaleString("en-IN")} Saving
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <h1 className="text-4xl md:text-5xl font-outfit font-extrabold text-primary leading-tight">
                                {listing.name}
                            </h1>
                            <div className="flex items-center gap-2 text-text-muted text-lg">
                                <FaMapMarkerAlt className="text-secondary" />
                                <span>{listing.address}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 border-y border-slate-100">
                        <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white shadow-sm border border-slate-50">
                            <FaBed className="text-2xl text-secondary" />
                            <span className="text-sm font-bold text-primary">{listing.bedrooms} Beds</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white shadow-sm border border-slate-50">
                            <FaBath className="text-2xl text-secondary" />
                            <span className="text-sm font-bold text-primary">{listing.bathrooms} Baths</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white shadow-sm border border-slate-50">
                            <FaParking className="text-2xl text-secondary" />
                            <span className="text-sm font-bold text-primary">{listing.parking ? "Parking" : "No Parking"}</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white shadow-sm border border-slate-50">
                            <FaChair className="text-2xl text-secondary" />
                            <span className="text-sm font-bold text-primary">{listing.furnished ? "Furnished" : "Unfurnished"}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl font-outfit font-bold text-primary">About this property</h2>
                        <p className="text-text-main text-lg leading-relaxed whitespace-pre-line font-sans">
                            {listing.description}
                        </p>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-28 space-y-6">
                        <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-premium space-y-4">
                            <p className="text-text-muted font-bold text-sm uppercase tracking-wider">Property Price</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-outfit font-extrabold text-primary">₹{listing.offer
                                    ? listing.discountedPrice.toLocaleString("en-IN")
                                    : listing.regularPrice.toLocaleString("en-IN")}</span>
                                {listing.type === "rent" && <span className="text-text-muted font-semibold">/ month</span>}
                            </div>
                            {listing.offer && (
                                <p className="text-slate-400 line-through text-lg decoration-accent/30 font-medium">
                                    ₹{listing.regularPrice.toLocaleString("en-IN")}
                                </p>
                            )}
                        </div>

                        <Contact listing={listing} />
                    </div>
                </div>
            </div>
        </main>
    );
}
