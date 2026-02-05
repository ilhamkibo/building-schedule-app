
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRoles } from "@/hooks/use-role";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

function UserForm({
    user,
    onCancel,
    onSubmit,
}: {
    user: User | null;
    onCancel: () => void;
    onSubmit: (payload: {
        name: string;
        username: string;
        roleId: number;
    }) => void;
}) {
    const { data: roles = [], isLoading } = useRoles();

    const [name, setName] = useState(user?.name ?? "");
    const [username, setUsername] = useState(user?.username ?? "");
    const [roleId, setRoleId] = useState<number | null>(
        user?.role?.id ?? null
    );
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    useEffect(() => {
        if (user?.role?.name && roles.length > 0) {
            const found = roles.find(
                (r) => r.name === user.role.name
            );
            if (found) setRoleId(found.id);
        }
    }, [user, roles]);


    return (
        <div className="space-y-4">
            {/* Name */}
            <div className="flex flex-col gap-2">
                <Label>Name</Label>
                <Input
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-2">
                <Label>Username</Label>
                <Input
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>

            {/* Role */}
            <div className="flex flex-col gap-2">
                <Label>Role</Label>

                <Select
                    value={roleId?.toString()}
                    onValueChange={(v) => setRoleId(Number(v))}
                    disabled={isLoading}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>



            {/* Password */}
            <div className="flex flex-col gap-2">
                <Label>Password</Label>
                <Input
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>


            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
                <Label>Confirm Password</Label>
                <Input
                    placeholder="Enter confirm password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
            </div>


            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    onClick={() =>
                        onSubmit({
                            name,
                            username,
                            roleId: roleId!,
                        })
                    }
                    disabled={!name || !username || !roleId}
                >
                    {user ? "Update" : "Create"}
                </Button>
            </div>
        </div>
    );
}

export default UserForm;
