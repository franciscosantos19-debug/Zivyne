import { NextRequest, NextResponse } from 'next/server';
import { buildAmateurAffiliateUrl } from '@/lib/providers/amateur';

export const dynamic = 'force-dynamic';

// Legacy affiliate short-links: recover destination mapping when available.
// Unknown codes use the configured general Amateur.tv affiliate URL instead of 404.
export async function GET(request: NextRequest, { params }: { params: Promise<{ code: string[] }> }) {
  const { code } = await params;
  if (!code.length || code.some(part => !/^[a-zA-Z0-9_-]{1,100}$/.test(part))) {
    return NextResponse.redirect(new URL('/', 'https://zivyne.online'), 302);
  }
  const url = new URL(buildAmateurAffiliateUrl());
  const host = url.hostname.toLowerCase();
  if (url.protocol !== 'https:' || !['iw0.net', 'amateur.tv'].some(d => host === d || host.endsWith('.' + d))) {
    return NextResponse.json({ error: 'Affiliate destination unavailable' }, { status: 503 });
  }
  const response = NextResponse.redirect(url, 302);
  response.headers.set('Cache-Control', 'no-store');
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;
}
