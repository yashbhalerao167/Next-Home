'use client';

import { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";
import {
    updateUserStart,
    updateUserFailure,
    updateUserSuccess,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutUserStart,
    signOutUserSuccess,
    signOutUserFailure,
} from "@/lib/redux/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";
import { FaCamera, FaPlus, FaSignOutAlt, FaTrashAlt, FaEdit, FaSync } from "react-icons/fa";
import Skeleton from "@/components/Skeleton";
import EmptyState from "@/components/EmptyState";

export default function Profile() {
    const fileRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | undefined>(undefined);
    const [filePercentage, setFilePercentage] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingsError, setShowListingsError] = useState(false);
    const [userListings, setUserListings] = useState<any[]>([]);
    const [fetchingListings, setFetchingListings] = useState(false);

    const { currentUser, loading, error } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    const handleFileUpload = (file: File) => {
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePercentage(Math.round(progress));
            },
            () => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData((prev: any) => ({ ...prev, avatar: downloadURL }));
                });
            }
        );
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev: any) => ({
            ...prev,
            [e.target.id]: e.target.value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/${currentUser._id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            setTimeout(() => setUpdateSuccess(false), 3000);
        } catch (error: any) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
        try {
            dispatch(deleteUserStart());
            const res = await fetch(`/api/user/${currentUser._id}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }
            dispatch(deleteUserSuccess());
            router.push("/sign-in");
        } catch (error: any) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const handleSignOut = async () => {
        try {
            dispatch(signOutUserStart());
            const res = await fetch("/api/auth/signout");
            const data = await res.json();
            if (data.success === false) {
                dispatch(signOutUserFailure(data.message));
                return;
            }
            dispatch(signOutUserSuccess());
            router.push("/sign-in");
        } catch (error: any) {
            dispatch(signOutUserFailure(error.message));
        }
    };

    const handleShowListings = async () => {
        try {
            setFetchingListings(true);
            setShowListingsError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingsError(true);
                setFetchingListings(false);
                return;
            }
            setUserListings(data);
            setFetchingListings(false);
        } catch {
            setShowListingsError(true);
            setFetchingListings(false);
        }
    };

    const handleListingDelete = async (listingId: string) => {
        if (!confirm("Delete this listing permanently?")) return;
        try {
            const res = await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
            const data = await res.json();
            if (data.success === false) return;
            setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));
        } catch (error) {
            console.error(error);
        }
    };

    if (!currentUser) {
        if (typeof window !== 'undefined') router.push('/sign-in');
        return null;
    }

    return (
        <main className="min-h-screen bg-background pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="pt-16 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-outfit font-extrabold text-primary mb-2">My Profile</h1>
                        <p className="text-text-muted">Manage your account settings and property listings</p>
                    </div>
                    <Link href="/create-listing" className="btn-premium bg-secondary text-white hover:bg-blue-700 shadow-lg shadow-secondary/20">
                        <FaPlus size={14} /> List New Property
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-white relative overflow-hidden">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10">
                                <div className="relative self-center group">
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        ref={fileRef}
                                        onChange={(e) => setFile(e.target.files?.[0])}
                                    />
                                    <div className="relative">
                                        <img
                                            onClick={() => fileRef.current?.click()}
                                            src={formData?.avatar || currentUser?.avatar}
                                            alt="profile"
                                            className="rounded-full h-32 w-32 cursor-pointer object-cover border-4 border-white shadow-xl ring-4 ring-secondary/5 transition-all duration-300 group-hover:scale-105"
                                        />
                                        <div
                                            onClick={() => fileRef.current?.click()}
                                            className="absolute bottom-1 right-1 bg-secondary text-white p-2.5 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-colors duration-300 ring-4 ring-white"
                                        >
                                            <FaCamera size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    {fileUploadError ? (
                                        <p className="text-red-500 text-xs font-bold bg-red-50 py-2 rounded-xl">Upload Error (Max 2MB)</p>
                                    ) : filePercentage > 0 && filePercentage < 100 ? (
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                                            <div className="bg-secondary h-full transition-all duration-300" style={{ width: `${filePercentage}%` }} />
                                        </div>
                                    ) : filePercentage === 100 ? (
                                        <p className="text-green-600 text-xs font-bold bg-green-50 py-2 rounded-xl">Avatar updated!</p>
                                    ) : null}
                                </div>

                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Username</label>
                                        <input
                                            type="text"
                                            id="username"
                                            defaultValue={currentUser?.username}
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none"
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            defaultValue={currentUser?.email}
                                            className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                            onChange={handleChange}
                                            disabled={currentUser?.isGoogleUser}
                                        />
                                    </div>

                                    {!currentUser?.isGoogleUser ? (
                                        <>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1 text-secondary">Current Password</label>
                                                <input
                                                    type="password"
                                                    id="currentPassword"
                                                    placeholder="Required to change password..."
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none"
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    placeholder="Enter new security code..."
                                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none"
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <div className="flex items-center gap-3 text-secondary">
                                                <div className="bg-white p-2 rounded-lg shadow-sm">
                                                    <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold uppercase tracking-widest leading-none">Connected with Google</span>
                                                    <span className="text-[10px] text-slate-400 mt-1">Managed via Single Sign-On</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    disabled={loading}
                                    className="btn-premium w-full bg-primary text-white hover:bg-slate-800 py-4 shadow-lg shadow-primary/10"
                                >
                                    {loading ? "Syncing..." : "Update Settings"}
                                </button>
                            </form>

                            <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                                <button onClick={handleDelete} className="text-red-400 hover:text-red-600 text-sm font-bold flex items-center gap-2 transition-colors">
                                    <FaTrashAlt size={12} /> Delete Account
                                </button>
                                <button onClick={handleSignOut} className="text-slate-400 hover:text-primary text-sm font-bold flex items-center gap-2 transition-colors">
                                    <FaSignOutAlt size={12} /> Sign Out
                                </button>
                            </div>

                            {error && <p className="mt-4 p-3 bg-red-50 text-red-600 rounded-2xl text-xs font-bold text-center animate-shake">{error}</p>}
                            {updateSuccess && <p className="mt-4 p-3 bg-green-50 text-green-600 rounded-2xl text-xs font-bold text-center animate-fade-in">Profile Updated!</p>}
                        </div>
                    </aside>

                    <div className="lg:col-span-2">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-white h-full min-h-[600px]">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                                <h2 className="text-2xl font-outfit font-bold text-primary">Managed Listings</h2>
                                <button
                                    onClick={handleShowListings}
                                    className="flex items-center gap-2 text-secondary font-bold hover:text-blue-700 transition-colors text-sm"
                                >
                                    <FaSync size={12} className={userListings.length > 0 ? "animate-spin-once" : ""} /> Refresh
                                </button>
                            </div>

                            {showListingsError && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl mb-6">
                                    <p className="text-red-600 text-sm font-bold text-center">Failed to fetch properties. Try again.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fetchingListings ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="bg-white border border-slate-100 p-4 rounded-3xl flex items-center gap-4">
                                            <Skeleton className="h-20 w-24 rounded-2xl" />
                                            <div className="flex-1 space-y-2">
                                                <Skeleton className="h-5 w-3/4" />
                                                <Skeleton className="h-4 w-1/4" />
                                            </div>
                                        </div>
                                    ))
                                ) : userListings.length === 0 ? (
                                    <div className="col-span-full">
                                        <EmptyState
                                            title="No Listings found"
                                            message="You haven't added any properties yet. Your active listings will appear here."
                                            actionLabel="List My First Property"
                                            actionHref="/create-listing"
                                        />
                                    </div>
                                ) : (
                                    userListings.map((listing) => (
                                        <div
                                            key={listing._id}
                                            className="group bg-white border border-slate-100 p-4 rounded-3xl flex items-center gap-4 hover:shadow-premium-hover transition-all duration-300"
                                        >
                                            <Link href={`/listing/${listing._id}`} className="shrink-0 overflow-hidden rounded-2xl">
                                                <img
                                                    className="h-20 w-24 object-cover transform transition-transform duration-500 group-hover:scale-110"
                                                    src={listing.imageURL[0]}
                                                    alt="listing"
                                                />
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/listing/${listing._id}`}
                                                    className="text-primary font-bold truncate block hover:text-secondary mb-1 transition-colors"
                                                >
                                                    {listing.name}
                                                </Link>
                                                <p className="text-secondary font-outfit font-bold">₹{listing.regularPrice.toLocaleString('en-IN')}</p>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <Link href={`/update-listing/${listing._id}`}>
                                                    <button className="p-2 text-green-500 hover:bg-green-50 rounded-xl transition-colors">
                                                        <FaEdit size={16} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleListingDelete(listing._id)}
                                                    className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-colors"
                                                >
                                                    <FaTrashAlt size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
