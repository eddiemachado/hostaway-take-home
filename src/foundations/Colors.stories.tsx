import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta = { title: "Foundations/Colors" };
export default meta;
type Story = StoryObj;

const Swatch = ({ name, className, varName }: { name: string; className?: string; varName?: string }) => (
    <div className="flex flex-col gap-1.5">
        <div
            className={`h-14 rounded-lg border border-secondary ${className ?? ""}`}
            style={varName ? { backgroundColor: `var(${varName})` } : undefined}
        />
        <code className="text-xs text-tertiary">{name}</code>
    </div>
);

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold tracking-wide text-tertiary uppercase">{title}</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">{children}</div>
    </section>
);

const Ramp = ({ title, prefix }: { title: string; prefix: string }) => (
    <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-tertiary">{title}</h3>
        <div className="flex overflow-hidden rounded-lg border border-secondary">
            {[25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((s) => (
                <div key={s} className="h-12 flex-1" style={{ backgroundColor: `var(--color-${prefix}-${s})` }} title={`${prefix}-${s}`} />
            ))}
        </div>
    </section>
);

export const Semantic: Story = {
    render: () => (
        <div className="flex max-w-4xl flex-col gap-8">
            <Group title="Background">
                <Swatch name="bg-primary" className="bg-primary" />
                <Swatch name="bg-secondary" className="bg-secondary" />
                <Swatch name="bg-tertiary" className="bg-tertiary" />
                <Swatch name="bg-brand-solid" className="bg-brand-solid" />
                <Swatch name="bg-success-solid" className="bg-success-solid" />
                <Swatch name="bg-warning-solid" className="bg-warning-solid" />
                <Swatch name="bg-error-solid" className="bg-error-solid" />
                <Swatch name="bg-active" className="bg-active" />
            </Group>
            <Group title="Border">
                <Swatch name="border-primary" varName="--color-border-primary" />
                <Swatch name="border-secondary" varName="--color-border-secondary" />
                <Swatch name="border-brand" varName="--color-border-brand" />
                <Swatch name="border-error" varName="--color-border-error" />
            </Group>
            <section className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold tracking-wide text-tertiary uppercase">Text</h3>
                <div className="flex flex-col gap-1 rounded-lg border border-secondary bg-primary p-4">
                    <p className="text-md text-primary">text-primary — primary content</p>
                    <p className="text-md text-secondary">text-secondary — supporting content</p>
                    <p className="text-md text-tertiary">text-tertiary — muted content</p>
                    <p className="text-md text-quaternary">text-quaternary — subtle / metadata</p>
                    <p className="text-md text-brand-secondary">text-brand-secondary — links & emphasis</p>
                </div>
            </section>
        </div>
    ),
};

export const Palettes: Story = {
    render: () => (
        <div className="flex max-w-4xl flex-col gap-6">
            <Ramp title="Brand" prefix="brand" />
            <Ramp title="Utility · Green (success)" prefix="utility-green" />
            <Ramp title="Utility · Yellow (warning)" prefix="utility-yellow" />
            <Ramp title="Utility · Red (error)" prefix="utility-red" />
            <Ramp title="Utility · Blue" prefix="utility-blue" />
        </div>
    ),
};
