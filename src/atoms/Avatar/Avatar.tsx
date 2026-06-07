import { cx } from "@/utils/cx";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps {
    /** Full name — used for initials fallback and the accessible label. */
    name: string;
    /** Optional image URL. Falls back to initials if absent or it fails to load. */
    src?: string;
    size?: AvatarSize;
    className?: string;
}

const sizes: Record<AvatarSize, string> = {
    xs: "size-6 text-xs",
    sm: "size-8 text-sm",
    md: "size-10 text-md",
    lg: "size-12 text-lg",
};

function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** User/entity avatar with image and initials fallback. */
export const Avatar = ({ name, src, size = "md", className }: AvatarProps) => {
    return (
        <span
            className={cx(
                "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-utility-neutral-100 font-semibold text-utility-neutral-700 ring-1 ring-inset ring-utility-neutral-200",
                sizes[size],
                className,
            )}
            role="img"
            aria-label={name}
        >
            {src ? <img src={src} alt="" className="size-full object-cover" /> : <span aria-hidden="true">{initials(name)}</span>}
        </span>
    );
};
