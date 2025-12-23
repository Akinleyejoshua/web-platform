import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPass = process.env.ADMIN_PASS;

        if (!adminEmail || !adminPass) {
            return NextResponse.json(
                { error: 'Admin credentials not configured' },
                { status: 500 }
            );
        }

        if (email === adminEmail && password === adminPass) {
            // Simple token-based auth (in production, use proper JWT)
            const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

            const response = NextResponse.json(
                { success: true, message: 'Authentication successful' },
                { status: 200 }
            );

            // Set HTTP-only cookie
            response.cookies.set('admin_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours
                path: '/',
            });

            return response;
        }

        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        );
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

export async function DELETE() {
    const response = NextResponse.json(
        { success: true, message: 'Logged out successfully' },
        { status: 200 }
    );

    response.cookies.delete('admin_token');

    return response;
}
