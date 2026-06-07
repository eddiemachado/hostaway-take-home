import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FilterLines } from "@untitledui/icons";
import { FilterBuilder } from "./FilterBuilder";
import { Button } from "@/components/base/buttons/button";
import { applyFilters, summarize, type AppliedFilter } from "@/lib/filtering";
import { RESERVATIONS, RESERVATION_FIELDS } from "@/pages/ReservationsPage/data";

const meta: Meta<typeof FilterBuilder> = { title: "Organisms/FilterBuilder", parameters: { layout: "padded" } };
export default meta;
type Story = StoryObj;

/** The multi-filter centerpiece: stage several conditions, watch the live count, Apply once. */
const Demo = () => {
    const [open, setOpen] = useState(false);
    const [filters, setFilters] = useState<AppliedFilter[]>([]);
    return (
        <div className="flex flex-col gap-4">
                <FilterBuilder
                    trigger={
                        <Button color="secondary" iconLeading={FilterLines}>
                            Add filter
                        </Button>
                    }
                    isOpen={open}
                    onOpenChange={setOpen}
                    fields={RESERVATION_FIELDS}
                    appliedFilters={filters}
                    onApply={setFilters}
                    previewCount={(f) => applyFilters(RESERVATIONS, f, RESERVATION_FIELDS).length}
                    totalCount={RESERVATIONS.length}
                />
                <div className="text-sm text-tertiary">
                    Applied:{" "}
                    {filters.length === 0
                        ? "none"
                        : filters.map((f) => `${RESERVATION_FIELDS.find((x) => x.id === f.fieldId)?.label}: ${summarize(RESERVATION_FIELDS.find((x) => x.id === f.fieldId)!, f.value)}`).join(" · ")}
                </div>
            </div>
    );
};

export const Default: Story = { render: () => <Demo /> };
