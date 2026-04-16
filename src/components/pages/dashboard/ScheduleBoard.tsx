"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useState, useEffect } from "react";
import { ScheduleTable } from "./ScheduleTable";
import { Shift } from "@/types/shift";
import { TodayLineSchedule } from "@/types/schedule";

export default function ScheduleBoard({ data, shiftTime }: { data: TodayLineSchedule[]; shiftTime: Shift[] }) {
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

    const onDragEnd = (e: DragEndEvent) => {
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
                <ScheduleTable key={block.id} block={block} shiftTime={shiftTime} />
            ))}
        </div>
        /* </SortableContext>
    </DndContext> */
    );
}