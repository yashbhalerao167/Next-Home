'use client';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
}

export default function Skeleton({ className = "", variant = 'rect' }: SkeletonProps) {
    const variantClasses = {
        text: 'h-4 w-full rounded',
        rect: 'h-full w-full rounded-2xl',
        circle: 'h-12 w-12 rounded-full',
    };

    return (
        <div className={`relative overflow-hidden bg-slate-200/60 ${variantClasses[variant]} ${className}`}>
            <div className="absolute inset-0 animate-shimmer" />
        </div>
    );
}
