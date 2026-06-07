import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaginationLine } from "@/components/application/pagination/pagination-line";

/** Untitled UI Pagination (real component). */
const meta: Meta = { title: "Molecules/Pagination" };
export default meta;
type Story = StoryObj;

const Demo = () => {
    const [page, setPage] = useState(4);
    return <PaginationLine page={page} total={20} onPageChange={setPage} />;
};

export const Default: Story = { render: () => <Demo /> };
