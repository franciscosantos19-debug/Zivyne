import type { NextRequest } from 'next/server';

// Avoid internal localhost:PORT redirects behind the Render proxy.
// Only trusted public hosts can be used to construct absolute redirects.
const publicHosts = new Set(['zivyne.onrender.com', 'zivyne.online', 'www.zivyne.online']);
export function publicUrl(path: string, request: NextRequest): URL {
  const forwarded = request.headers.get('x-forwarded-host')?.split(',')[0].trim().toLowerCase();
  const host = (forwarded || request.headers.get('host') || '').split(':')[0].toLowerCase();
  const safeHost = publicHosts.has(host) ? host : 'zivyne.onrender.com';
  return new URL(path, `https://${safeHost}`);
}
