import { SearchLg } from "@untitledui/icons";
import { Input, type InputProps } from "@/atoms/Input";

export type SearchInputProps = Omit<InputProps, "icon" | "type">;

/** Search field — Input + search icon, type="search". */
export const SearchInput = ({ placeholder = "Search", ...props }: SearchInputProps) => (
    <Input icon={SearchLg} type="search" placeholder={placeholder} {...props} />
);
