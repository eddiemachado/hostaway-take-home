import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "./SearchInput";
import { FilterChip } from "./FilterChip";
import { Pagination } from "./Pagination";

const meta: Meta = { title: "Molecules/Misc" };
export default meta;
type Story = StoryObj;

const SearchDemo = () => {
    const [value, setValue] = useState("");
    return (
        <div className="w-80">
            <SearchInput value={value} onChange={(e) => setValue(e.target.value)} placeholder="Search guest, code, property…" />
        </div>
    );
};

const PaginationDemo = () => {
    const [page, setPage] = useState(4);
    return <Pagination page={page} pageCount={20} onPageChange={setPage} />;
};

export const SearchInputStory: Story = { name: "SearchInput", render: () => <SearchDemo /> };

export const FilterChipStory: Story = {
    name: "FilterChip",
    render: () => (
        <div className="flex flex-wrap gap-2">
            <FilterChip label="Channel" value="Airbnb, Vrbo" onRemove={() => {}} />
            <FilterChip label="Status" value="Confirmed" onRemove={() => {}} />
            <FilterChip label="Total" value="≥ 500" onRemove={() => {}} />
        </div>
    ),
};

export const PaginationStory: Story = { name: "Pagination", render: () => <PaginationDemo /> };
