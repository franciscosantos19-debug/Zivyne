import { NextRequest, NextResponse } from 'next/server';
const cookie='zivyne_age_confirmed';
export function middleware(request: NextRequest) {
  const path=request.nextUrl.pathname;
  if(['/age','/age/denied','/legal','/privacy','/affiliate-disclosure','/api/age/confirm'].includes(path)) return NextResponse.next();
  if(request.cookies.get(cookie)?.value==='1') return NextResponse.next();
  if(path.startsWith('/api/') || path.startsWith('/go/')) return new NextResponse('Age confirmation required',{status:403});
  const url=new URL('/age',request.url);
  if(path!=='/') url.searchParams.set('next',path);
  return NextResponse.redirect(url);
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)']};
