import Link from 'next/link';
export default async function AgePage({searchParams}:{searchParams:Promise<{next?:string}>}) {
 const {next}=await searchParams; const target=next?.startsWith('/')&&!next.startsWith('//') ? next : '/';
 return <main className="gate"><div className="gateCard"><div className="logo">ZIVYNE</div><h1>Adults only</h1><p>This website features adult-oriented live creators. You must be 18 or older (or the age of majority where you live).</p><form action="/api/age/confirm" method="POST"><input type="hidden" name="next" value={target}/><button type="submit">I am 18 or older</button></form><Link href="/age/denied">I am under 18</Link></div></main>;
}
