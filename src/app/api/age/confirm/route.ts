import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: NextRequest) {
 const form=await request.formData();
 const candidate=String(form.get('next') || '/');
 const target=candidate.startsWith('/')&&!candidate.startsWith('//')?candidate:'/';
 const response=NextResponse.redirect(new URL(target,request.url),303);
 response.cookies.set('zivyne_age_confirmed','1',{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
 return response;
}
