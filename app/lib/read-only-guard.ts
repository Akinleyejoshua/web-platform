import { NextRequest, NextResponse } from 'next/server';

/**
 * Checks if the incoming request is from a read-only admin session.
 * @param request The NextRequest object
 * @returns true if read-only mode is active
 */
export function isReadOnlyRequest(request: NextRequest): boolean {
    const cookies = request.cookies;
    return cookies.get('admin_read_only')?.value === 'true';
}

/**
 * Returns a 403 Response if the request is in read-only mode.
 * Use this at the beginning of any write operation (POST, PUT, DELETE, PATCH).
 * @param request The NextRequest object
 * @returns Response to return if read-only, otherwise null
 */
export function denyIfReadOnly(request: NextRequest): NextResponse | null {
    if (isReadOnlyRequest(request)) {
        return NextResponse.json(
            { error: 'Read-only mode: Write operations are disabled.' },
            { status: 403 }
        );
    }
    return null;
}
