"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { ScheduleBlock } from "./ScheduleTable";
import { scheduleBlocks } from "./dummy";

export default function ScheduleBoard() {
    const [items, setItems] = useState(scheduleBlocks);

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
        <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-6">
                    {items.map((block) => (
                        <ScheduleBlock key={block.id} block={block} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
