'use client';

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ListingItem from "@/components/ListingItem";
import { FaFilter, FaSearch, FaChevronDown, FaSpinner } from "react-icons/fa";
import Skeleton from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";

function SearchContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [sideBarData, setSideBarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "createdAt",
        order: "desc",
    });
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState<any[]>([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const searchTerm = searchParams.get("searchTerm");
        const type = searchParams.get("type");
        const parking = searchParams.get("parking");
        const furnished = searchParams.get("furnished");
        const offer = searchParams.get("offer");
        const sort = searchParams.get("sort");
        const order = searchParams.get("order");

        if (searchTerm || type || parking || furnished || offer || sort || order) {
            setSideBarData({
                searchTerm: searchTerm || "",
                type: type || "all",
                parking: parking === "true" ? true : false,
                furnished: furnished === "true" ? true : false,
                offer: offer === "true" ? true : false,
                sort: sort || "createdAt",
                order: order || "desc",
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = searchParams.toString();
            const response = await fetch(`/api/listings?${searchQuery}`);
            const data = await response.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        };

        fetchListings();
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { id, value, checked } = target;

        if (id === "all" || id === "rent" || id === "sell") {
            setSideBarData({ ...sideBarData, type: id });
        }

        if (id === "searchTerm") {
            setSideBarData({ ...sideBarData, searchTerm: value });
        }

        if (id === "parking" || id === "furnished" || id === "offer") {
            setSideBarData({
                ...sideBarData,
                [id]: checked,
            });
        }

        if (id === "sort_order") {
            const sort = value.split("_")[0] || "createdAt";
            const order = value.split("_")[1] || "desc";
            setSideBarData({ ...sideBarData, sort, order });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sideBarData.searchTerm);
        urlParams.set("type", sideBarData.type);
        urlParams.set("parking", sideBarData.parking.toString());
        urlParams.set("furnished", sideBarData.furnished.toString());
        urlParams.set("offer", sideBarData.offer.toString());
        urlParams.set("sort", sideBarData.sort);
        urlParams.set("order", sideBarData.order);
        router.push(`/search?${urlParams.toString()}`);
    };

    const onShowMore = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(searchParams);
        urlParams.set("startIndex", startIndex.toString());
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listings?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    };

    return (
        <div className="flex flex-col md:flex-row bg-background min-h-screen">
            <aside className="p-8 md:w-80 lg:w-96 bg-white border-r border-slate-200">
                <div className="sticky top-24">
                    <div className="flex items-center gap-2 mb-8 text-primary">
                        <FaFilter className="text-secondary" />
                        <h2 className="text-xl font-outfit font-bold">Search Filters</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Search Keywords</label>
                            <div className="relative group">
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 p-3.5 pl-10 rounded-2xl text-primary focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all"
                                    type="text"
                                    id="searchTerm"
                                    placeholder="e.g. Modern Villa..."
                                    value={sideBarData.searchTerm}
                                    onChange={handleChange}
                                />
                                <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-secondary transition-colors" size={14} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Listing Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'all', label: 'All' },
                                    { id: 'rent', label: 'Rent' },
                                    { id: 'sell', label: 'Sale' },
                                    { id: 'offer', label: 'Offers' },
                                ].map((type) => (
                                    <label key={type.id} className={`flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all ${(type.id === 'offer' ? sideBarData.offer : sideBarData.type === type.id)
                                        ? "bg-secondary/10 border-secondary text-secondary font-bold"
                                        : "bg-white border-slate-200 text-text-muted hover:border-slate-300"
                                        }`}>
                                        <input
                                            type="checkbox"
                                            id={type.id}
                                            className="hidden"
                                            checked={type.id === 'offer' ? sideBarData.offer : sideBarData.type === type.id}
                                            onChange={handleChange}
                                        />
                                        <span className="text-sm">{type.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Amenities</label>
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { id: 'parking', label: 'Parking' },
                                    { id: 'furnished', label: 'Furnished' },
                                ].map((amenity) => (
                                    <label key={amenity.id} className={`flex items-center justify-center gap-2 p-3 rounded-2xl border cursor-pointer transition-all ${sideBarData[amenity.id as keyof typeof sideBarData]
                                        ? "bg-secondary/10 border-secondary text-secondary font-bold"
                                        : "bg-white border-slate-200 text-text-muted hover:border-slate-300"
                                        }`}>
                                        <input
                                            type="checkbox"
                                            id={amenity.id}
                                            className="hidden"
                                            checked={sideBarData[amenity.id as keyof typeof sideBarData] as boolean}
                                            onChange={handleChange}
                                        />
                                        <span className="text-sm">{amenity.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Sort Order</label>
                            <div className="relative">
                                <select
                                    id="sort_order"
                                    className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-primary focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none appearance-none transition-all cursor-pointer"
                                    onChange={handleChange}
                                    defaultValue="createdAt_desc"
                                >
                                    <option value="regularPrice_desc">Price: High to Low</option>
                                    <option value="regularPrice_asc">Price: Low to High</option>
                                    <option value="createdAt_desc">Newest First</option>
                                    <option value="createdAt_asc">Oldest First</option>
                                </select>
                                <FaChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={12} />
                            </div>
                        </div>

                        <button className="btn-premium bg-primary text-white hover:bg-slate-800 py-4 mt-4 shadow-lg shadow-primary/10">
                            Update Results
                        </button>
                    </form>
                </div>
            </aside>

            <main className="flex-1 p-8 lg:p-12">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
                    <div>
                        <h1 className="text-3xl font-outfit font-bold text-primary mb-1">Listing Results</h1>
                        <p className="text-text-muted">
                            {listings.length} properties found for your criteria
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {!loading && listings.length === 0 && (
                        <div className="col-span-full">
                            <EmptyState />
                        </div>
                    )}

                    {loading && (
                        Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-[2.5rem] p-4 shadow-premium border border-white space-y-4">
                                <Skeleton className="h-56 w-full" />
                                <div className="space-y-3 px-2 pb-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <div className="flex justify-between items-center pt-2">
                                        <Skeleton className="h-8 w-24" />
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {!loading && listings && listings.map((listing: any) => (
                        <ListingItem key={listing._id} listing={listing} />
                    ))}

                    {showMore && (
                        <div className="col-span-full pt-12 flex justify-center">
                            <button
                                onClick={onShowMore}
                                className="btn-premium bg-white border border-slate-200 text-primary hover:bg-slate-50 px-10 py-4 shadow-sm group"
                            >
                                <FaChevronDown className="group-hover:translate-y-1 transition-transform" />
                                Show more properties
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-secondary" size={40} />
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
