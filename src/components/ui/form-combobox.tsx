"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";

export interface ComboboxOption {
    id: number;
    name: string;
    code?: string;
}

interface FormComboboxProps {
    value?: number;
    onChange: (value: number) => void;
    options?: ComboboxOption[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
}

export function FormCombobox({
    value,
    onChange,
    options = [],
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    className,
}: FormComboboxProps) {
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between font-normal", className)}
                >
                    {value
                        ? options.find((item) => item.id === value)?.name
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map((item) => (
                                <CommandItem
                                    key={item.id}
                                    value={`${item.name} ${item.id}`} // Ensure uniqueness and searchability
                                    onSelect={() => {
                                        onChange(item.id);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === item.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {item.name} {item.code ? `(${item.code})` : ""}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
