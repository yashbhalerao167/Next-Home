'use client';

import { FaSearch, FaHome } from 'react-icons/fa';
import Link from 'next/link';

interface EmptyStateProps {
    title?: string;
    message?: string;
    icon?: React.ReactNode;
    actionLabel?: string;
    actionHref?: string;
}

export default function EmptyState({
    title = "No results found",
    message = "Try adjusting your filters or search terms to find what you're looking for.",
    icon = <FaSearch size={40} className="text-slate-300" />,
    actionLabel = "Browse All Properties",
    actionHref = "/search"
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in-up">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                {icon}
            </div>
            <h3 className="text-2xl font-outfit font-bold text-primary mb-2">{title}</h3>
            <p className="text-text-muted max-w-sm mb-10 leading-relaxed">{message}</p>
            {actionLabel && (
                <Link
                    href={actionHref}
                    className="btn-premium bg-primary text-white hover:bg-slate-800 px-8 py-4 shadow-xl shadow-primary/10"
                >
                    <FaHome size={16} />
                    {actionLabel}
                </Link>
            )}
        </div>
    );
}
