
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
import { Eye, EyeOff } from "lucide-react";

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
        password?: string;
        passwordConfirmation?: string;
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
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

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
                <div className="relative">
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>


            {/* Confirm Password */}
            <div className="flex flex-col gap-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                    <Input
                        type={showPasswordConfirmation ? "text" : "password"}
                        placeholder="Enter confirm password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        className="pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    >
                        {showPasswordConfirmation ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>
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
                            password,
                            passwordConfirmation,
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
