import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = { title: "Foundations/Elevation & Radius" };
export default meta;
type Story = StoryObj;

export const Shadows: Story = {
    render: () => (
        <div className="grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3">
            {["shadow-xs", "shadow-sm", "shadow-md", "shadow-lg", "shadow-xl", "shadow-2xl"].map((s) => (
                <div key={s} className="flex flex-col items-center gap-3">
                    <div className={`size-24 rounded-xl border border-secondary bg-primary ${s}`} />
                    <code className="text-xs text-tertiary">{s}</code>
                </div>
            ))}
        </div>
    ),
};

export const Radius: Story = {
    render: () => (
        <div className="grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
            {["rounded-xs", "rounded-sm", "rounded-md", "rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-full"].map((r) => (
                <div key={r} className="flex flex-col items-center gap-3">
                    <div className={`size-24 border border-brand bg-brand-primary ${r}`} />
                    <code className="text-xs text-tertiary">{r}</code>
                </div>
            ))}
        </div>
    ),
};
