import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Role } from "@/types/role";

function RoleForm({
    role,
    onCancel,
    onSubmit,
}: {
    role: Role | null;
    onCancel: () => void;
    onSubmit: (name: string) => void;
}) {
    const [name, setName] = useState(role?.name || "");

    useEffect(() => {
        setName(role?.name || "");
    }, [role]);
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <Label>Role Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={() => onSubmit(name)} disabled={!name}>
                    {role ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}

export default RoleForm;