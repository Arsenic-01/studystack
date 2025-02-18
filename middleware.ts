import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, USER_COLLECTION_ID, DATABASE_ID } from '@/lib/appwrite';
import { Query } from 'node-appwrite';

export async function middleware(req: NextRequest) {
  const sessionToken = (await cookies()).get('sessionToken')?.value;

  // Protect routes: redirect to login if not authenticated
  if (!sessionToken) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  try {
    const users = await db.listDocuments(DATABASE_ID!, USER_COLLECTION_ID!, [
      Query.equal('sessionToken', sessionToken),
    ]);

    if (users.total === 0) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    const user = users.documents[0];

    // Authorization checks
    if (req.nextUrl.pathname.includes('/admin') && user.role !== 'admin') {
      return NextResponse.redirect(new URL('/home', req.url)); // Redirect to home instead of looping back to "/"
    }
    if (req.nextUrl.pathname.includes('/teacher') && user.role !== 'teacher') {
      return NextResponse.redirect(new URL('/home', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Session verification failed:', error);
    return NextResponse.next(); // Avoid redirect loops by allowing next request
  }
}

export const config = {
  matcher: ['/admin/:path*', '/home', '/semester/:sem*'],
};
