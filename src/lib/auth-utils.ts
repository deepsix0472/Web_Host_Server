import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Get the current authenticated user from the session
 * Use in Server Components and API routes
 */
export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    return session?.user;
}

/**
 * Require authentication - throws error if not authenticated
 * Use in API routes
 */
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }
    return user;
}

/**
 * Require authentication and redirect to login if not authenticated
 * Use in Server Components (pages)
 */
export async function requireAuthRedirect() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    return user;
}

/**
 * Check if user has a specific role
 */
export async function requireRole(allowedRoles: string[]) {
    const user = await requireAuth();
    if (!allowedRoles.includes(user.role)) {
        throw new Error("Forbidden: Insufficient permissions");
    }
    return user;
}

/**
 * Check role for API routes - returns NextResponse if unauthorized
 */
export async function requireRoleApi(allowedRoles: string[]): Promise<
    { authorized: true; user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>> } |
    { authorized: false; response: NextResponse }
> {
    const user = await getCurrentUser();

    if (!user) {
        return {
            authorized: false,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        };
    }

    if (!allowedRoles.includes(user.role)) {
        return {
            authorized: false,
            response: NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 })
        };
    }

    return { authorized: true, user };
}

/**
 * Shorthand for ADMIN role check
 */
export async function requireAdmin() {
    return requireRoleApi(['ADMIN']);
}

/**
 * Shorthand for ADMIN or COACH role check
 */
export async function requireCoachOrAdmin() {
    return requireRoleApi(['ADMIN', 'COACH']);
}

/**
 * Get session for use in API route responses
 * Returns null if not authenticated (doesn't throw)
 */
export async function getSession() {
    return await getServerSession(authOptions);
}
