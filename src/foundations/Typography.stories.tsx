import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = { title: "Foundations/Typography" };
export default meta;
type Story = StoryObj;

const ROWS = [
    { name: "display-2xl", className: "text-display-2xl font-semibold" },
    { name: "display-xl", className: "text-display-xl font-semibold" },
    { name: "display-lg", className: "text-display-lg font-semibold" },
    { name: "display-md", className: "text-display-md font-semibold" },
    { name: "display-sm", className: "text-display-sm font-semibold" },
    { name: "display-xs", className: "text-display-xs font-semibold" },
    { name: "xl", className: "text-xl font-medium" },
    { name: "lg", className: "text-lg font-medium" },
    { name: "md", className: "text-md" },
    { name: "sm", className: "text-sm" },
    { name: "xs", className: "text-xs" },
];

export const Scale: Story = {
    render: () => (
        <div className="flex max-w-4xl flex-col gap-5">
            {ROWS.map((r) => (
                <div key={r.name} className="flex items-baseline gap-6 border-b border-secondary pb-4">
                    <code className="w-28 shrink-0 text-xs text-quaternary">{r.name}</code>
                    <span className={`text-primary ${r.className}`}>The quick brown fox</span>
                </div>
            ))}
        </div>
    ),
};

export const Weights: Story = {
    render: () => (
        <div className="flex flex-col gap-3">
            {[
                ["Regular", "font-normal"],
                ["Medium", "font-medium"],
                ["Semibold", "font-semibold"],
                ["Bold", "font-bold"],
            ].map(([label, cls]) => (
                <div key={label} className="flex items-baseline gap-6">
                    <code className="w-24 shrink-0 text-xs text-quaternary">{label}</code>
                    <span className={`text-lg text-primary ${cls}`}>Reservations dashboard</span>
                </div>
            ))}
        </div>
    ),
};
