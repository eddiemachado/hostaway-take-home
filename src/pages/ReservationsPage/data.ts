import type { FieldDef } from "@/lib/filtering";

export type Channel = "Airbnb" | "Booking.com" | "Vrbo" | "Direct";
export type ReservationStatus = "Confirmed" | "Pending" | "Cancelled" | "Checked-in" | "Checked-out";

export interface Reservation {
    id: string;
    code: string;
    guestName: string;
    property: string;
    channel: Channel;
    status: ReservationStatus;
    checkIn: string; // ISO yyyy-mm-dd
    checkOut: string;
    nights: number;
    total: number;
}

const FIRST = [
    "Ava", "Liam", "Noah", "Emma", "Olivia", "Ethan", "Mia", "Lucas", "Sophia", "Mason",
    "Isla", "Leo", "Aria", "Kai", "Nora", "Hugo", "Zoe", "Ivan", "Maya", "Omar",
    "Lena", "Theo", "Ruby", "Finn", "Yara", "Cole", "Nina", "Sam", "Tara", "Dax",
    "Elsa", "Reed", "Vera", "Jude", "Lola", "Ravi",
];
const LAST = ["Reyes", "Khan", "Silva", "Nguyen", "Brooks", "Patel", "Lopez", "Walsh", "Kim", "Owens", "Costa", "Haas"];
const PROPERTIES = ["Seaside Loft", "Downtown Studio", "Garden Cottage", "Skyline Penthouse", "Harbor Bungalow", "Maple House", "Old Town Flat", "Cliffside Villa"];
const CHANNELS: Channel[] = ["Airbnb", "Booking.com", "Vrbo", "Direct"];
const STATUSES: ReservationStatus[] = ["Confirmed", "Pending", "Cancelled", "Checked-in", "Checked-out"];

function isoAdd(base: Date, days: number): string {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

/** Deterministic mock dataset (~36 rows) centered on the current period. */
function build(): Reservation[] {
    const base = new Date("2026-05-10");
    return Array.from({ length: 36 }, (_, i) => {
        const guestName = `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`;
        const nights = 2 + (i % 8);
        const checkInOffset = (i * 5) % 70;
        const checkIn = isoAdd(base, checkInOffset);
        const checkOut = isoAdd(base, checkInOffset + nights);
        const status = STATUSES[(i * 2 + (i % 3)) % STATUSES.length];
        const channel = CHANNELS[i % CHANNELS.length];
        const total = 380 + ((i * 137) % 12) * 95 + nights * 60;
        return {
            id: `r-${1000 + i}`,
            code: `HA-${28400 + i * 7}`,
            guestName,
            property: PROPERTIES[i % PROPERTIES.length],
            channel,
            status,
            checkIn,
            checkOut,
            nights,
            total,
        };
    });
}

export const RESERVATIONS: Reservation[] = build();

const opts = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

/** Filterable field definitions — drive FilterControl + the apply logic. */
export const RESERVATION_FIELDS: FieldDef[] = [
    { id: "guestName", label: "Guest", type: "text", accessor: (r) => (r as Reservation).guestName },
    { id: "code", label: "Confirmation code", type: "text", accessor: (r) => (r as Reservation).code },
    { id: "property", label: "Property", type: "enum", options: opts(PROPERTIES), accessor: (r) => (r as Reservation).property },
    { id: "channel", label: "Channel", type: "enum", options: opts(CHANNELS), accessor: (r) => (r as Reservation).channel },
    { id: "status", label: "Status", type: "enum", options: opts(STATUSES), accessor: (r) => (r as Reservation).status },
    { id: "checkIn", label: "Check-in", type: "date", accessor: (r) => (r as Reservation).checkIn },
    { id: "checkOut", label: "Check-out", type: "date", accessor: (r) => (r as Reservation).checkOut },
    { id: "total", label: "Total ($)", type: "number", accessor: (r) => (r as Reservation).total },
];
