import { NextRequest, NextResponse } from 'next/server';
import { publicUrl } from '@/lib/publicUrl';

export const dynamic = 'force-dynamic';

// All previously published /r/... links now lead to the ZIVYNE homepage.
// 302 avoids browsers retaining an irreversible cached redirect.
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(publicUrl('/', request), 302);
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
