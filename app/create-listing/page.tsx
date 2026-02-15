'use client';

import { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import { FaCloudUploadAlt, FaTrash, FaHome, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair, FaTag } from "react-icons/fa";

export default function CreateListing() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [formData, setFormData] = useState<any>({
        imageURL: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        parking: false,
        furnished: false,
        offer: false,
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 50,
        discountedPrice: 0,
    });
    const [imageUploadError, setImageError] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { currentUser } = useSelector((state: RootState) => state.user);
    const router = useRouter();

    const handleImageSubmit = () => {
        if (files && files.length > 0 && files.length + formData.imageURL.length < 7) {
            setUploading(true);
            setImageError("");
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageURL: formData.imageURL.concat(urls),
                    });
                    setImageError("");
                    setUploading(false);
                })
                .catch(() => {
                    setImageError("Image upload failed (max 2MB per image)");
                    setUploading(false);
                });
        } else {
            setImageError("Maximum 6 images allowed per listing");
            setUploading(false);
        }
    };

    const storeImage = async (file: File) => {
        return new Promise((resolve, reject) => {
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${Math.round(progress)}% done`);
                },
                (err) => reject(err),
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index: number) => {
        setFormData({
            ...formData,
            imageURL: formData.imageURL.filter((_: any, i: number) => i !== index),
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;

        if (id === "sell" || id === "rent") {
            setFormData({ ...formData, type: id });
        }

        if (id === "parking" || id === "furnished" || id === "offer") {
            setFormData({ ...formData, [id]: (e.target as HTMLInputElement).checked });
        }

        if (type === "number" || type === "text" || type === "textarea") {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (formData.imageURL.length < 1) return setError("Please upload at least one image");
            if (+formData.regularPrice <= +formData.discountedPrice) return setError("Discounted price must be less than regular price");

            setLoading(true);
            setError(null);

            const res = await fetch("/api/listings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, userRef: currentUser?._id }),
            });

            const data = await res.json();
            if (data.success === false) {
                setLoading(false);
                setError(data.message);
                return;
            }
            setLoading(false);
            router.push(`/listing/${data._id}`);
        } catch (error: any) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-background pb-20">
            <div className="max-w-6xl mx-auto px-6">
                <div className="pt-16 pb-12 text-center lg:text-left">
                    <h1 className="text-4xl font-outfit font-extrabold text-primary mb-2">Create Property</h1>
                    <p className="text-text-muted">Turn your property into a listing that stands out.</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8 h-full">
                        <section className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-white space-y-6">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-2 bg-secondary/10 text-secondary rounded-lg">
                                    <FaHome size={18} />
                                </span>
                                <h2 className="text-xl font-outfit font-bold text-primary">Core Details</h2>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Property Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    placeholder="e.g. Modern Cliffside Villa"
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none"
                                    maxLength={62}
                                    minLength={10}
                                    required
                                    onChange={handleChange}
                                    value={formData.name}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    id="description"
                                    placeholder="Tell the story of this property..."
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none h-32 resize-none"
                                    required
                                    onChange={handleChange}
                                    value={formData.description}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest ml-1">Address</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        id="address"
                                        placeholder="Full address here..."
                                        className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all outline-none"
                                        required
                                        onChange={handleChange}
                                        value={formData.address}
                                    />
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" />
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-white space-y-8">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="p-2 bg-accent/10 text-accent rounded-lg">
                                    <FaTag size={18} />
                                </span>
                                <h2 className="text-xl font-outfit font-bold text-primary">Amenities & Pricing</h2>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.type === 'sell' ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                    <label className="flex items-center justify-center gap-2 cursor-pointer w-full h-full font-bold">
                                        <input type="checkbox" id="sell" className="hidden" onChange={handleChange} checked={formData.type === "sell"} />
                                        <span>Sell</span>
                                    </label>
                                </div>
                                <div className={`flex-1 min-w-[120px] p-4 rounded-2xl border-2 transition-all cursor-pointer ${formData.type === 'rent' ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                    <label className="flex items-center justify-center gap-2 cursor-pointer w-full h-full font-bold">
                                        <input type="checkbox" id="rent" className="hidden" onChange={handleChange} checked={formData.type === "rent"} />
                                        <span>Rent</span>
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.parking ? 'bg-secondary/5 border-secondary text-secondary' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    <input type="checkbox" id="parking" className="w-5 h-5 accent-secondary" onChange={handleChange} checked={formData.parking} />
                                    <FaParking size={18} />
                                    <span className="font-bold text-sm">Parking</span>
                                </label>
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.furnished ? 'bg-secondary/5 border-secondary text-secondary' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    <input type="checkbox" id="furnished" className="w-5 h-5 accent-secondary" onChange={handleChange} checked={formData.furnished} />
                                    <FaChair size={18} />
                                    <span className="font-bold text-sm">Furnished</span>
                                </label>
                                <label className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${formData.offer ? 'bg-accent/5 border-accent text-accent' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                    <input type="checkbox" id="offer" className="w-5 h-5 accent-accent" onChange={handleChange} checked={formData.offer} />
                                    <span className="font-bold text-sm">Offer?</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Beds</label>
                                    <div className="relative">
                                        <input type="number" id="bedrooms" min="1" max="50" required className="w-full bg-slate-50 border border-slate-100 p-4 pl-10 rounded-2xl outline-none" onChange={handleChange} value={formData.bedrooms} />
                                        <FaBed className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Baths</label>
                                    <div className="relative">
                                        <input type="number" id="bathrooms" min="1" max="50" required className="w-full bg-slate-50 border border-slate-100 p-4 pl-10 rounded-2xl outline-none" onChange={handleChange} value={formData.bathrooms} />
                                        <FaBath className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" />
                                    </div>
                                </div>
                                <div className="col-span-full md:col-span-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Regular (₹)</label>
                                        <input type="number" id="regularPrice" required className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-primary outline-none" onChange={handleChange} value={formData.regularPrice} />
                                        <p className="text-[10px] text-slate-400 font-bold text-center">Price per {formData.type === 'rent' ? 'month' : 'listing'}</p>
                                    </div>
                                    {formData.offer && (
                                        <div className="space-y-2 animate-fade-in">
                                            <label className="text-xs font-bold text-accent uppercase tracking-widest ml-1">Offer (₹)</label>
                                            <input type="number" id="discountedPrice" required className="w-full bg-accent/5 border border-accent/20 p-4 rounded-2xl font-bold text-accent outline-none" onChange={handleChange} value={formData.discountedPrice} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-8 flex flex-col">
                        <section className="bg-white p-8 rounded-[2.5rem] shadow-premium border border-white flex-1 space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                        <FaCloudUploadAlt size={18} />
                                    </span>
                                    <h2 className="text-xl font-outfit font-bold text-primary">Media Gallery</h2>
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Max 6 images</span>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <input
                                        onChange={(e) => setFiles(e.target.files)}
                                        className="hidden"
                                        type="file"
                                        id="images"
                                        accept="image/*"
                                        multiple
                                    />
                                    <label
                                        htmlFor="images"
                                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-secondary/40 transition-all duration-300"
                                    >
                                        <FaCloudUploadAlt className="text-4xl text-secondary mb-2" />
                                        <span className="font-bold text-slate-500 text-sm">{files && files.length > 0 ? `${files.length} selected` : 'Select property images'}</span>
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    disabled={uploading}
                                    onClick={handleImageSubmit}
                                    className="px-8 bg-primary text-white rounded-3xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg"
                                >
                                    {uploading ? "..." : "Upload"}
                                </button>
                            </div>

                            {imageUploadError && <p className="text-xs text-red-500 font-bold bg-red-50 p-4 rounded-2xl animate-shake">{imageUploadError}</p>}

                            <div className="grid grid-cols-2 gap-4 mt-6">
                                {formData.imageURL.length === 0 && (
                                    <div className="col-span-full py-20 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100 flex items-center justify-center">
                                        <p className="text-slate-300 text-sm font-bold uppercase tracking-widest">Upload floor plans or photos</p>
                                    </div>
                                )}
                                {formData.imageURL.map((url: string, index: number) => (
                                    <div key={url} className="group relative rounded-2xl overflow-hidden border border-slate-100 shadow-sm aspect-video">
                                        <img src={url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="preview" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-110 shadow-xl"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                        {index === 0 && (
                                            <span className="absolute top-2 left-2 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase shadow-lg">Featured</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="mt-8">
                            <button
                                disabled={loading || uploading}
                                className="btn-premium w-full bg-secondary text-white hover:bg-blue-700 py-6 text-lg shadow-xl shadow-secondary/20 group"
                            >
                                {loading ? "Publishing..." : "Launch Listing"}
                            </button>
                            {error && <p className="text-red-500 text-sm text-center mt-4 bg-red-50 p-4 rounded-2xl font-bold">{error}</p>}
                        </div>
                    </div>
                </form>
            </div>
        </main>
    );
}
