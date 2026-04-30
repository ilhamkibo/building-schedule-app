"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCheckIcon, GripVertical, Trash2, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormCombobox } from "@/components/ui/form-combobox";
import { FormItem } from "@/types/schedule";
import { Product } from "@/types/product";
import { useState, useEffect, useRef } from "react";

interface SortableRowProps {
    item: FormItem;
    index: number;
    removeItem: (index: number) => void;
    updateItem: (index: number, updates: Partial<FormItem>) => void;
    products: Product[];
    isProductsLoading: boolean;
    setSearch: (search: string) => void;
    canEditBO?: boolean;
}

export function StaticRow({
    item,
}: {
    item: FormItem;
}) {
    return (
        <div className="flex items-center gap-2 p-2 bg-white border rounded shadow-sm">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20 shrink-0">
                {item.priority}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">
                    {item.codeNo || "New Product"}
                </div>
                <div className="text-xs text-muted-foreground">
                    Qty: {item.qty}
                </div>
            </div>
        </div>
    );
}

export function SortableRow({
    item,
    index,
    removeItem,
    updateItem,
    products,
    isProductsLoading,
    setSearch,
    canEditBO = true,
}: SortableRowProps) {
    const [isBoFocused, setIsBoFocused] = useState(false);
    const [isQtyFocused, setIsQtyFocused] = useState(false);

    const [highlightQty, setHighlightQty] = useState(false);
    const [highlightBo, setHighlightBo] = useState(false);

    const prevQtyRef = useRef(item.qty);
    const prevBoRef = useRef(item.boQty);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (item.qty !== prevQtyRef.current) {
            if (!isQtyFocused) {
                setHighlightQty(true);
                timer = setTimeout(() => setHighlightQty(false), 2000);
            }
            prevQtyRef.current = item.qty;
        }
        return () => clearTimeout(timer);
    }, [item.qty, isQtyFocused]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (item.boQty !== prevBoRef.current) {
            if (!isBoFocused) {
                setHighlightBo(true);
                timer = setTimeout(() => setHighlightBo(false), 2000);
            }
            prevBoRef.current = item.boQty;
        }
        return () => clearTimeout(timer);
    }, [item.boQty, isBoFocused]);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group bg-background border rounded-lg pb-4 px-2 shadow-sm transition-all hover:border-primary/30 ${isDragging ? "ring-2 ring-primary border-primary" : ""
                }`}
        >
            <div className="flex items-start gap-3">
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="mt-7 cursor-grab hover:text-primary transition-colors shrink-0"
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Priority Circle */}
                <div className="w-8 h-8 mt-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                    {item.priority}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end pb-1">
                        {/* Code No */}
                        <div className="flex flex-col justify-end h-[60px]">
                            <Label className="text-[10px] uppercase text-muted-foreground mb-1">
                                Code No
                            </Label>

                            {!item.isManual ? (
                                <div className="h-8 flex items-center justify-center bg-muted/30 rounded text-xs font-medium border">
                                    {item.size}
                                </div>
                            ) : (
                                <FormCombobox
                                    className="h-8"
                                    value={item.codeNo}
                                    onChange={(val: string) => {
                                        const product = products.find(
                                            (p) => p.codeNo === val
                                        );
                                        updateItem(index, {
                                            codeNo: product?.codeNo.replace(" ", "") || "",
                                            stockRc: product?.faStock || 0,
                                            size: product?.codeNo.replace(" ", "") || "",
                                            rim: product?.rim
                                                ? String(product.rim)
                                                : "",
                                        });
                                    }}
                                    onSearch={setSearch}
                                    isLoading={isProductsLoading}
                                    options={(() => {
                                        const opts = (products || []).map((p) => ({
                                            id: String(p.codeNo),
                                            name: String(p.codeNo),
                                        }));
                                        if (
                                            item.codeNo &&
                                            !opts.find((o) => o.id === item.codeNo)
                                        ) {
                                            opts.unshift({
                                                id: item.codeNo,
                                                name: item.codeNo,
                                            });
                                        }
                                        return opts;
                                    })()}
                                />
                            )}
                        </div>

                        {/* Stock RC */}
                        <div className="flex flex-col justify-end h-[60px]">
                            <Label className="text-[10px] uppercase text-muted-foreground mb-1">
                                Stock RC
                            </Label>
                            <div className="h-8 flex items-center justify-center bg-muted/30 rounded text-xs font-medium border">
                                {item.stockRc || 0}
                            </div>
                        </div>

                        {/* PPL Reference */}
                        <div className="flex flex-col justify-end h-[60px]">
                            <Label className="text-[10px] uppercase text-muted-foreground mb-1">
                                PPL Reference Qty
                            </Label>
                            <div className="h-8 flex items-center justify-center bg-muted/30 rounded text-xs font-medium border">
                                {item.qtyPpl || 0}
                            </div>
                        </div>

                        {/* Is Build Ach */}
                        <div className="flex flex-col justify-end h-[60px]">
                            <Label className="text-[10px] uppercase text-muted-foreground mb-1">
                                Is Build Ach
                            </Label>
                            <div className="h-8 flex items-center justify-center bg-muted/30 rounded text-xs font-medium border">
                                {item.isBuildAch ?
                                    (<>
                                        <CheckCheckIcon className="h-4 w-4 text-green-500" />
                                        <span className="ml-1">{item.buildAchQty || 0}</span>
                                    </>) : (<>
                                        <XIcon className="h-4 w-4 text-red-500" />
                                    </>)}
                            </div>
                        </div>

                        {/* BO Quantity */}
                        <div className="flex flex-col justify-end h-[60px]">
                            <Label className="text-[10px] uppercase text-muted-foreground mb-1">
                                B.O
                            </Label>
                            <Input
                                type="text"
                                className={`h-8 text-center transition-colors duration-500 ${highlightBo ? 'bg-amber-100 border-amber-500 ring-1 ring-amber-500 font-bold text-amber-900' : 'bg-white'} ${!canEditBO ? 'cursor-not-allowed bg-gray-100 opacity-70' : ''}`}
                                value={isBoFocused ? (item.boQty ?? "") : (item.boQty === null || item.boQty === undefined || item.boQty === "" ? "" : (Number(item.boQty) <= 10 ? "F" : item.boQty))}
                                onFocus={() => setIsBoFocused(true)}
                                onBlur={() => setIsBoFocused(false)}
                                onChange={(e) => {
                                    if (!canEditBO) return;
                                    updateItem(index, {
                                        boQty: parseInt(e.target.value) || 0,
                                    })
                                }}
                                readOnly={!canEditBO}
                            />
                            {/* <div className="h-8 flex items-center justify-center bg-muted/30 rounded text-xs font-medium border">
                                {item.boQty || 0}
                            </div> */}
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col justify-end h-[60px]">
                            <Label className="text-[10px] uppercase text-muted-foreground mb-1">
                                Quantity
                            </Label>
                            <Input
                                type="number"
                                className={`h-8 text-center number-to-text transition-all ease-in-out duration-200 ${highlightQty ? 'bg-amber-100 border-amber-500 ring-1 ring-amber-500 font-bold text-amber-900' : 'bg-white'}`}
                                value={item.qty}
                                onFocus={() => setIsQtyFocused(true)}
                                onBlur={() => setIsQtyFocused(false)}
                                onChange={(e) =>
                                    updateItem(index, {
                                        qty: parseInt(e.target.value) || 0,
                                    })
                                }
                            />
                        </div>

                        {/* Remark */}
                        <div className="flex flex-col justify-end h-[60px] col-span-2 lg:col-span-1">
                            <Label className="text-[10px] uppercase text-muted-foreground mb-1">
                                Remark
                            </Label>
                            <Input
                                className="h-8 text-xs bg-white"
                                placeholder="Add remark..."
                                value={item.remark}
                                onChange={(e) =>
                                    updateItem(index, {
                                        remark: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* Delete Button */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-7 h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 shrink-0"
                    onClick={() => removeItem(index)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}