"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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

export interface ComboboxOption<T extends string | number = number> {
    id: T;
    name: string;
    code?: string;
}

interface FormComboboxProps<T extends string | number = number> {
    value?: T;
    onChange: (value: T) => void;
    onSearch?: (value: string) => void;
    options?: ComboboxOption<T>[];
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    isLoading?: boolean;
    className?: string;
}

export function FormCombobox<T extends string | number = number>({
    value,
    onChange,
    onSearch,
    options = [],
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyText = "No results found.",
    isLoading = false,
    className,
}: FormComboboxProps<T>) {
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
                    {value !== undefined && value !== null
                        ? options.find((item) => item.id === value)?.name
                        : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder={searchPlaceholder} onValueChange={onSearch} />
                    <CommandList>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Searching...</span>
                            </div>
                        ) : (
                            <>
                                <CommandEmpty>{emptyText}</CommandEmpty>
                                <CommandGroup>
                                    {options.map((item) => (
                                        <CommandItem
                                            key={item.id.toString()}
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
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
