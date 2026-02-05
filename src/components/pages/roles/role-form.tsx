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
    onSubmit: () => void;
}) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2">
                <Label>Role Name</Label>
                <Input defaultValue={role?.name} />
            </div>

            <div className="flex flex-col gap-2">
                <Label>Description</Label>
                <Input defaultValue={role?.description ?? ""} />
            </div>

            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={onSubmit}>
                    {role ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}

export default RoleForm;