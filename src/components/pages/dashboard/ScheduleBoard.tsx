"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useState, useEffect } from "react";
import { ScheduleBlock } from "./ScheduleTable";
import { Shift } from "@/types/shift";

export default function ScheduleBoard({ data, shiftTime }: { data: any[]; shiftTime: Shift[] }) {
    const [items, setItems] = useState(data);

    useEffect(() => {
        setItems(data);
    }, [data]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const onDragEnd = (e: any) => {
        const { active, over } = e;
        if (!over || active.id === over.id) return;

        setItems((prev) => {
            const oldIndex = prev.findIndex((i) => i.id === active.id);
            const newIndex = prev.findIndex((i) => i.id === over.id);
            return arrayMove(prev, oldIndex, newIndex);
        });
    };

    return (
        /* <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
            modifiers={[restrictToVerticalAxis]}
        > */
        /* <SortableContext
            items={items.map((i) => i.id)}
            strategy={verticalListSortingStrategy}
        > */
        <div className="space-y-6">
            {items.map((block) => (
                <ScheduleBlock key={block.id} block={block} shiftTime={shiftTime} />
            ))}
        </div>
        /* </SortableContext>
    </DndContext> */
    );
}