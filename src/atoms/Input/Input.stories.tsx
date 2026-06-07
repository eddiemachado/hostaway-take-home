import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchLg } from "@untitledui/icons";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
    title: "Atoms/Input",
    component: Input,
    args: { placeholder: "Enter text…", inputSize: "md" },
    argTypes: { inputSize: { control: "select", options: ["sm", "md"] }, isInvalid: { control: "boolean" } },
};
export default meta;
type Story = StoryObj<typeof Input>;

const Controlled = (args: React.ComponentProps<typeof Input>) => {
    const [value, setValue] = useState("");
    return <Input {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const Playground: Story = { render: (args) => <div className="w-80"><Controlled {...args} /></div> };

export const WithIcon: Story = { render: () => <div className="w-80"><Controlled icon={SearchLg} placeholder="Search…" /></div> };

export const Invalid: Story = { render: () => <div className="w-80"><Controlled isInvalid placeholder="Required field" /></div> };
