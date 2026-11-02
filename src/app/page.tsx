import Link from 'next/link';
import { HoverVideo } from '@/components/HoverVideo';
import { getAmateurCreators } from '@/lib/providers/amateur';
export const dynamic = 'force-dynamic';
const sections = [
  { id: 'men', label: 'Men' },
  { id: 'trans', label: 'Trans' },
  { id: 'couples', label: 'Couples' }
] as const;
export default async function Home() {
  const creators = (await getAmateurCreators())
    .filter(c => c.online && c.provider === 'amateur' && ['men','trans','couples'].includes(c.category))
    .sort((a,b)=>b.viewers-a.viewers);
  return <main className="zivyneCams zivyneCompact">
    <header><div className="shell nav"><Link className="logo" href="/">ZIVYNE<span className="brandDot">.</span></Link><nav><a href="#men">Men</a><a href="#trans">Trans</a><a href="#couples">Couples</a></nav></div></header>
    <div className="shell">
      <div className="zivyneMainHeading"><div><h1>Live Models</h1><p>Live now on Amateur.tv</p></div><span className="headerLive">● {creators.length} LIVE</span></div>
      <nav className="zivyneNavTabs"><a href="#men">Men</a><a href="#trans">Trans</a><a href="#couples">Couples</a></nav>
      {sections.map(section=>{
        const items=creators.filter(c=>c.category===section.id);
        if(!items.length)return null;
        return <section key={section.id} id={section.id} className="section"><div className="heading"><h2>{section.label}</h2><span>{items.length} live</span></div>
          <div className="grid">{items.map(c=><a className="card" href={'/go/'+encodeURIComponent(c.slug)} key={c.slug} rel="nofollow">
            <div className="photo">{c.imageUrl ? <img src={c.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer"/> : <span className="placeholder">{c.name.slice(0,1)}</span>}<HoverVideo videoUrl={c.videoUrl} /><span className="live">● LIVE</span></div>
            <div className="details"><strong>{c.name}</strong><span>{c.viewers ? c.viewers.toLocaleString()+' watching':'Live now'}</span></div>
          </a>)}</div></section>;
      })}
      {!creators.length&&<section className="section"><h2>No creators available right now</h2></section>}
    </div>
  </main>;
}
