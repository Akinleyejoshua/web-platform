import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();

  // Set admin token cookie (any value works for read-only)
  cookieStore.set('admin_token', 'read-only-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  // Set read-only flag cookie (accessible to client)
  cookieStore.set('admin_read_only', 'true', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return NextResponse.json({ success: true, redirect: '/admin' });
}
