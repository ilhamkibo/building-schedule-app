// "use client";

// import { useAuthContext } from "@/context/auth-context";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// const ROLE_PERMISSIONS: Record<string, string[]> = {
//     viewer: ["/"],
//     creator: ["/", "/ppl", "/schedules", "/new-schedule"],
//     admin: ["*"], // allow all
// };

// export default function RouteGuard({ children }: { children: React.ReactNode }) {
//     const { user } = useAuthContext();
//     const pathname = usePathname();
//     const router = useRouter();
//     const [authorized, setAuthorized] = useState(false);

//     useEffect(() => {
//         if (!user) {
//             router.push("/login");
//             return;
//         }

//         const role = user.role.toLowerCase();
//         const permissions = ROLE_PERMISSIONS[role] || [];

//         // Admin has full access
//         if (permissions.includes("*")) {
//             setAuthorized(true);
//             return;
//         }

//         // Check if current path starts with any allowed paths
//         // Special case for root "/" to avoid matching everywhere
//         const isAuthorized = permissions.some(path => {
//             if (path === "/") return pathname === "/";
//             return pathname.startsWith(path);
//         });

//         if (!isAuthorized) {
//             router.push("/");
//         } else {
//             setAuthorized(true);
//         }
//     }, [user, pathname, router]);

//     if (!authorized) return null;

//     return <>{children}</>;
// }

"use client";

import { useAuthContext } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ROLE_PERMISSIONS: Record<string, string[]> = {
    viewer: ["/", "/user-guide"],
    editor: ["/", "/ppl", "/schedules", "/new-schedule", "/ppc", "/user-guide"],
    creator: ["/", "/ppl", "/schedules", "/new-schedule", "/ppc", "/user-guide"],
    admin: ["*"], // allow all
};

export default function RouteGuard({ children }: { children: React.ReactNode }) {
    const { user } = useAuthContext();
    const pathname = usePathname();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // ✅ Kalau belum login → treat sebagai viewer
        const role = user?.role?.toLowerCase() ?? "viewer";
        const permissions = ROLE_PERMISSIONS[role] || [];

        // Admin full access
        if (permissions.includes("*")) {
            setAuthorized(true);
            return;
        }

        const isAuthorized = permissions.some((path) => {
            if (path === "/") return pathname === "/";
            return pathname.startsWith(path);
        });

        if (!isAuthorized) {
            router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
        } else {
            setAuthorized(true);
        }
    }, [user, pathname, router]);

    if (!authorized) return null;

    return <>{children}</>;
}
