import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@/components/base/avatar/avatar";

/** Untitled UI Avatar (real component). */
const meta: Meta<typeof Avatar> = {
    title: "Atoms/Avatar",
    component: Avatar,
    tags: ["autodocs"],
    args: { size: "md", initials: "AR", alt: "Ava Reyes" },
    argTypes: {
        size: { control: "select", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
        initials: { control: "text" },
        src: { control: "text" },
    },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

/** Tweak size / initials / image from the Controls panel. */
export const Playground: Story = {};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((s) => (
                <Avatar key={s} size={s} initials="AR" alt="Ava Reyes" />
            ))}
        </div>
    ),
};

export const WithImage: Story = { args: { src: "https://i.pravatar.cc/120?img=5", alt: "Profile photo" } };
