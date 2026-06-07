import type { Meta, StoryObj } from "@storybook/react-vite";
import ReservationsPage from "./ReservationsPage";

const meta: Meta<typeof ReservationsPage> = {
    title: "Pages/Reservations",
    component: ReservationsPage,
    parameters: { layout: "fullscreen" },
};
export default meta;
type Story = StoryObj<typeof ReservationsPage>;

/** The full resulting page: header + tabs + actions, toolbar, multi-filter, data table. */
export const Default: Story = {};
