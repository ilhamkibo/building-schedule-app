"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Config } from "@/types/config";
import { Switch } from "@/components/ui/switch";

interface ConfigFormProps {
    config: Config | null;
    onCancel: () => void;
    onSubmit: (payload: {
        configKey: string;
        configValue: string;
        description: string;
        isActive: boolean;
    }) => void;
    isLoading?: boolean;
}

export default function ConfigForm({
    config,
    onCancel,
    onSubmit,
    isLoading,
}: ConfigFormProps) {
    const [configKey, setConfigKey] = useState(config?.configKey ?? "");
    const [configValue, setConfigValue] = useState(config?.configValue ?? "");
    const [description, setDescription] = useState(config?.description ?? "");
    const [isActive, setIsActive] = useState(config?.isActive ?? true);

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <Label>Config Key</Label>
                <Input
                    placeholder="e.g. RC_DURATION_LIMIT_HOURS"
                    value={configKey}
                    onChange={(e) => setConfigKey(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Config Value</Label>
                <Input
                    placeholder="e.g. 10"
                    value={configValue}
                    onChange={(e) => setConfigValue(e.target.value)}
                />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <textarea
                    placeholder="Enter config description"
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2">
                <Label>Active Status: </Label>
                <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                />
                <span className="text-sm text-muted-foreground">
                    {isActive ? "Active" : "Inactive"}
                </span>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => onSubmit({ configKey, configValue, description, isActive })}
                    disabled={isLoading || !configKey || !configValue}
                >
                    {isLoading ? "Saving..." : config ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}
