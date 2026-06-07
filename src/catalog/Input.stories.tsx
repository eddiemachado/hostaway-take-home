import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchLg } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";

/** Untitled UI Input (real component, React Aria TextField). */
const meta: Meta<typeof Input> = {
    title: "Atoms/Input",
    component: Input,
    tags: ["autodocs"],
    args: { label: "Guest name", placeholder: "e.g. Ava Reyes", size: "md", isDisabled: false },
    argTypes: {
        label: { control: "text" },
        placeholder: { control: "text" },
        hint: { control: "text" },
        size: { control: "select", options: ["sm", "md"] },
        isDisabled: { control: "boolean" },
        icon: { control: false },
    },
};
export default meta;
type Story = StoryObj<typeof Input>;

/** Tweak label / placeholder / size / disabled from the Controls panel. */
export const Playground: Story = { render: (args) => <div className="w-80"><Input {...args} /></div> };

export const WithIcon: Story = { render: () => <div className="w-80"><Input icon={SearchLg} placeholder="Search…" aria-label="Search" /></div> };

export const WithHint: Story = { render: () => <div className="w-80"><Input label="Email" placeholder="you@hostaway.com" hint="We'll only use this for booking updates." /></div> };
