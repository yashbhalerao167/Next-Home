'use client';

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/lib/redux/userSlice";
import { useRouter } from "next/navigation";

export default function OAuth() {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Google sign-in failed");

            dispatch(signInSuccess(data));
            router.push("/");
        } catch (error) {
            console.error("Google sign-in error:", error);
            alert("Failed to sign in with Google. Please try again.");
        }
    };

    return (
        <button
            onClick={handleGoogleClick}
            type="button"
            className="bg-red-700 text-white p-3 rounded-lg hover:opacity-95 uppercase font-semibold transition duration-200"
        >
            Continue with Google
        </button>
    );
}
