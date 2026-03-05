"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader, SheetDescription } from "@/components/ui/sheet";
import PPLReferenceSidebar from "../ppl-reference-sidebar";
import { PPL } from "@/types/ppl";

interface ResponsivePPLReferenceProps {
    ppls: PPL[] | undefined;
}

export function ResponsivePPLReference({ ppls }: ResponsivePPLReferenceProps) {
    return (
        <>
            {/* Desktop Sidebar: Visible only on large screens */}
            <div className="hidden bg-muted/10 flex-col overflow-hidden border rounded-l-xl">
                <PPLReferenceSidebar ppls={ppls} />
            </div>

            {/* Mobile/Tablet Trigger: Visible only under 1024px */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="default"
                        size="icon"
                        className="fixed bottom-24 right-6 z-50 rounded-full shadow-2xl w-14 h-14 bg-primary hover:bg-primary/90 transition-all active:scale-90 animate-in fade-in slide-in-from-bottom-10 duration-500"
                    >
                        <Search className="h-6 w-6 text-white" />
                        <span className="sr-only">PPL Reference</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[90%] sm:w-[450px] p-0 flex flex-col">
                    <SheetHeader className="sr-only">
                        <SheetTitle>PPL Reference Sidebar</SheetTitle>
                        <SheetDescription>Lookup PPL statistics and entries</SheetDescription>
                    </SheetHeader>
                    <PPLReferenceSidebar ppls={ppls} />
                </SheetContent>
            </Sheet>
        </>
    );
}
