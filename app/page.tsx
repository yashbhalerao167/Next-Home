import Link from "next/link";
import ListingItem from "@/components/ListingItem";
import HomeSwiper from "@/components/HomeSwiper";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";
import { FaArrowRight, FaHome, FaSearch } from "react-icons/fa";

export const dynamic = "force-dynamic";

async function getListings() {
  await dbConnect();
  const offerListings = await Listing.find({ offer: true }).limit(4).sort({ createdAt: -1 });
  const rentListings = await Listing.find({ type: "rent" }).limit(4).sort({ createdAt: -1 });
  const sellListings = await Listing.find({ type: "sell" }).limit(4).sort({ createdAt: -1 });

  return {
    offerListings: JSON.parse(JSON.stringify(offerListings)),
    rentListings: JSON.parse(JSON.stringify(rentListings)),
    sellListings: JSON.parse(JSON.stringify(sellListings)),
  };
}

export default async function Home() {
  const { offerListings, rentListings, sellListings } = await getListings();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary/80 z-10" />
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 animate-pulse-slow font-sans"
            style={{ animationDuration: '20s' }}
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest mb-6">
              <FaHome className="text-accent" /> Premium Real Estate
            </span>
            <h1 className="text-4xl md:text-7xl font-outfit font-extrabold text-white mb-6 leading-tight">
              Find the place where <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">your story begins</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
              Discover an exclusive collection of luxury properties tailored to your lifestyle.
              Beyond listings, we find you a home.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/search"
                className="btn-premium w-full sm:w-auto bg-secondary text-white hover:bg-blue-600 px-8 py-4"
              >
                Explore Properties <FaArrowRight size={14} />
              </Link>
              <Link
                href="/about"
                className="btn-premium w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 px-8 py-4"
              >
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Search Feature (Visual only for landing) */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-6 opacity-0 animate-fade-in md:block hidden" style={{ animationDelay: '0.4s' }}>
          <div className="glass p-4 rounded-3xl flex items-center gap-4 shadow-2xl">
            <div className="flex-1 px-4 border-r border-slate-200/50">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Location</span>
              <span className="text-primary font-semibold">City or Neighborhood</span>
            </div>
            <div className="flex-1 px-4 border-r border-slate-200/50">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Property Type</span>
              <span className="text-primary font-semibold">Modern Villa</span>
            </div>
            <div className="flex-1 px-4">
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">Price Range</span>
              <span className="text-primary font-semibold">Any Budget</span>
            </div>
            <Link href="/search" className="bg-primary text-white p-4 rounded-2xl hover:bg-secondary transition-colors">
              <FaSearch size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Slider */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-outfit font-bold text-primary mb-2">Editor's Choice</h2>
              <p className="text-text-muted">Hand-picked properties for sophisticated living</p>
            </div>
          </div>
          <HomeSwiper listings={offerListings} />
        </div>
      </section>

      {/* Listing results */}
      <div className="max-w-7xl mx-auto flex flex-col gap-20 py-20 px-6">
        {offerListings && offerListings.length > 0 && (
          <section>
            <div className="mb-10 flex items-end justify-between border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-outfit font-bold text-primary mb-2">Recent Offers</h2>
                <p className="text-text-muted">Explore exclusive deals and price drops</p>
              </div>
              <Link
                href={`/search?offer=true`}
                className="text-secondary font-bold text-sm hover:underline flex items-center gap-1 group"
              >
                View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {offerListings.map((listing: any) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {rentListings && rentListings.length > 0 && (
          <section>
            <div className="mb-10 flex items-end justify-between border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-outfit font-bold text-primary mb-2">Luxury Rentals</h2>
                <p className="text-text-muted">Premium homes for flexible modern living</p>
              </div>
              <Link
                href={`/search?type=rent`}
                className="text-secondary font-bold text-sm hover:underline flex items-center gap-1 group"
              >
                View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {rentListings.map((listing: any) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}

        {sellListings && sellListings.length > 0 && (
          <section>
            <div className="mb-10 flex items-end justify-between border-b border-slate-100 pb-6">
              <div>
                <h2 className="text-3xl font-outfit font-bold text-primary mb-2">Available to Buy</h2>
                <p className="text-text-muted">Invest in your future with our curated listings</p>
              </div>
              <Link
                href={`/search?type=sell`}
                className="text-secondary font-bold text-sm hover:underline flex items-center gap-1 group"
              >
                View All <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {sellListings.map((listing: any) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
