import { NextRequest, NextResponse } from 'next/server';
import { getAmateurCreators, buildAmateurAffiliateUrl } from '@/lib/providers/amateur';
import { publicUrl } from '@/lib/publicUrl';
export const dynamic = 'force-dynamic';
function permitted(url: URL) {
  const host = url.hostname.toLowerCase();
  return url.protocol === 'https:' && !url.username && !url.password &&
    ['amateur.tv','iw0.net'].some(domain=>host===domain || host.endsWith('.'+domain));
}
export async function GET(request: NextRequest, {params}: {params: Promise<{slug:string}>}) {
  const {slug}=await params;
  const creator=(await getAmateurCreators()).find(c=>c.slug===slug && c.provider==='amateur' && c.online);
  if(!creator) return NextResponse.redirect(publicUrl('/', request));
  let target: URL|undefined;
  try { if (creator.destinationUrl) { const url=new URL(creator.destinationUrl); if(permitted(url)) target=url; } } catch {}
  if(!target) {const fallback=new URL(buildAmateurAffiliateUrl(creator)); if(permitted(fallback)) target=fallback;}
  if(!target) return NextResponse.redirect(publicUrl('/', request));
  const res=NextResponse.redirect(target);
  res.headers.set('Cache-Control','no-store');
  res.headers.set('X-Robots-Tag','noindex, nofollow');
  return res;
}
