'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHome } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-primary text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                {/* Brand Section */}
                <div className="space-y-6">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="bg-secondary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                            <FaHome className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-outfit font-black tracking-tighter">
                            Next<span className="text-secondary">Home</span>
                        </span>
                    </Link>
                    <p className="text-slate-400 leading-relaxed font-medium">
                        Elevating the art of real estate. We connect discerning buyers with exceptional properties across the globe.
                    </p>
                    <div className="flex gap-4">
                        {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                            <a key={i} href="#" className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center hover:bg-secondary hover:text-white transition-all duration-300">
                                <Icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-outfit font-bold mb-6">Explore</h3>
                    <ul className="space-y-4">
                        {['Search Properties', 'Recent Listings', 'Featured Offers', 'Luxury Villas', 'Modern Apartments'].map((link) => (
                            <li key={link}>
                                <Link href="/search" className="text-slate-400 hover:text-secondary transition-colors font-medium flex items-center gap-2 group">
                                    <div className="w-1 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Account */}
                <div>
                    <h3 className="text-lg font-outfit font-bold mb-6">Membership</h3>
                    <ul className="space-y-4">
                        {['My Profile', 'Create Listing', 'Saved Properties', 'Sign In', 'Sign Up'].map((link) => (
                            <li key={link}>
                                <Link
                                    href={link === 'Create Listing' ? '/create-listing' : link === 'My Profile' ? '/profile' : link === 'Sign In' ? '/sign-in' : link === 'Sign Up' ? '/sign-up' : '/search'}
                                    className="text-slate-400 hover:text-secondary transition-colors font-medium flex items-center gap-2 group"
                                >
                                    <div className="w-1 h-1 bg-secondary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-outfit font-bold mb-6">Contact Us</h3>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-4 text-slate-400">
                            <FaMapMarkerAlt className="text-secondary mt-1 shrink-0" />
                            <span className="font-medium">Vishwakarma Institute of Technology, Pune - 411037</span>
                        </li>
                        <li className="flex items-center gap-4 text-slate-400">
                            <FaPhone className="text-secondary shrink-0" />
                            <span className="font-medium">+91 7276480578</span>
                        </li>
                        <li className="flex items-center gap-4 text-slate-400">
                            <FaEnvelope className="text-secondary shrink-0" />
                            <span className="font-medium">yashbhalerao167@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <p className="text-slate-500 text-sm font-medium italic">
                    © {new Date().getFullYear()} NextHome Real Estate. All rights reserved.
                </p>
                <div className="flex gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
