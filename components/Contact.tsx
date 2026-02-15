'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";

export default function Contact({ listing }: { listing: any }) {
    const [landlord, setLandLord] = useState<any>(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const response = await fetch(`/api/user/${listing.userRef}`);
                const data = await response.json();
                setLandLord(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchLandlord();
    }, [listing.userRef]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    };

    return (
        <>
            {landlord && (
                <div className="flex flex-col gap-6 mt-10 p-8 bg-white rounded-3xl border border-slate-100 shadow-premium">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <FaUserCircle size={32} />
                        </div>
                        <div>
                            <p className="text-text-muted text-sm font-medium">Property Owner</p>
                            <h3 className="text-primary font-outfit font-bold text-lg">{landlord.username}</h3>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-text-main leading-relaxed">
                            Interested in <span className="font-bold text-secondary">{listing.name}</span>?
                            Send a message to the owner for more details or to schedule a visit.
                        </p>

                        <div className="relative">
                            <textarea
                                onChange={handleChange}
                                name="message"
                                id="message"
                                rows={4}
                                placeholder="Write your inquiry here..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none text-primary"
                            ></textarea>
                        </div>

                        <Link
                            className="btn-premium w-full bg-primary text-white hover:bg-slate-800 py-4 shadow-lg shadow-primary/10"
                            href={`mailto:${landlord.email}?subject=Inquiry regarding ${listing.name}&body=${message}`}
                        >
                            Send Message <FaPaperPlane size={14} />
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
