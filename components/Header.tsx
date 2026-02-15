'use client';

import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/lib/redux/store";

export default function Header() {
    const { currentUser } = useSelector((state: RootState) => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const [isScrolled, setIsScrolled] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(searchParams.toString());
        urlParams.set("searchTerm", searchTerm);
        router.push(`/search?${urlParams.toString()}`);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const searchTermFromUrl = searchParams.get("searchTerm");
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [searchParams]);

    return (
        <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                    ? "bg-white/80 backdrop-blur-md shadow-lg py-2"
                    : "bg-transparent py-4"
                }`}
        >
            <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8">
                <Link href="/" className="group">
                    <h1 className="text-xl md:text-2xl font-outfit font-bold flex items-center gap-1">
                        <span className="text-primary group-hover:text-secondary transition-colors">Next</span>
                        <span className="text-secondary group-hover:text-primary transition-colors">Home</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-accent mb-auto mt-2" />
                    </h1>
                </Link>

                <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full relative group"
                    >
                        <input
                            type="text"
                            placeholder="Find your perfect home..."
                            className="w-full bg-slate-100/50 focus:bg-white border-none py-2.5 pl-4 pr-10 rounded-2xl text-sm focus:ring-2 focus:ring-secondary/20 transition-all duration-300 placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-secondary transition-colors"
                        >
                            <FaSearch size={16} />
                        </button>
                    </form>
                </div>

                <nav className="flex items-center gap-2 md:gap-6">
                    <ul className="flex items-center gap-2 md:gap-6">
                        <li>
                            <Link
                                href="/"
                                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-secondary transition-colors px-2 py-1"
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className="hidden sm:block text-sm font-medium text-slate-600 hover:text-secondary transition-colors px-2 py-1"
                            >
                                About
                            </Link>
                        </li>
                    </ul>

                    <div className="h-6 w-[1px] bg-slate-200 hidden sm:block mx-2" />

                    <Link href="/profile" className="flex items-center gap-3">
                        {currentUser ? (
                            <div className="relative group p-0.5 rounded-full ring-2 ring-transparent hover:ring-secondary/30 transition-all">
                                <img
                                    className="rounded-full h-9 w-9 object-cover border-2 border-white shadow-sm"
                                    src={currentUser.avatar}
                                    alt="profile"
                                />
                                <div className="absolute inset-0 rounded-full bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ) : (
                            <button className="btn-premium py-2 px-6 text-sm bg-primary text-white hover:bg-slate-800">
                                Sign In
                            </button>
                        )}
                    </Link>

                    {/* Mobile Search Toggle - simplified for now */}
                    <button className="md:hidden p-2 text-slate-600">
                        <FaSearch size={20} />
                    </button>
                </nav>
            </div>
        </header>
    );
}
