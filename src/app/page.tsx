import Link from 'next/link';
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
  const featured=creators.filter(c=>Boolean(c.imageUrl)).slice(0,12);
  return <main className="zivyneCams">
    <header><div className="shell nav"><Link className="logo" href="/">ZIVYNE<span className="brandDot">.</span></Link><nav>{sections.map(s=><a href={'#'+s.id} key={s.id}>{s.label}</a>)}</nav><span className="headerLive">● {creators.length} LIVE</span></div></header>
    <div className="shell">
      <section className="zivyneStage">
        <div className="zivyneStageText"><span className="eyebrow">EXCLUSIVELY AMATEUR.TV</span><h1>LIVE <em>ACTION</em></h1><p>Discover who's broadcasting right now.</p>
          <div className="zivyneStageLinks">{sections.map(s=><a key={s.id} href={'#'+s.id}>{s.label} ↗</a>)}</div>
        </div>
        {featured[0]?.imageUrl ? <img src={featured[0].imageUrl} alt="" className="zivyneStagePhoto" referrerPolicy="no-referrer"/> : null}
        <div className="zivyneStageShade"/>
      </section>
      <div className="zivyneCircleRow" aria-label="Featured live creators">
        {featured.slice(0,10).map(c=><a key={c.slug} href={'/go/'+encodeURIComponent(c.slug)} className="zivyneCircle" rel="nofollow">
          <span className="zivyneAvatar">{c.imageUrl ? <img src={c.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer"/> : c.name.slice(0,1)}</span>
          <span>{c.name}</span>
        </a>)}
      </div>
      <div className="zivyneGridHeading"><div><span className="eyebrow">ON AIR NOW</span><h2>Jump into <em>live action</em></h2><p>Real-time creators from Amateur.tv</p></div><span className="zivyneTotal">● {creators.length} LIVE</span></div>
      {sections.map(section=>{
        const items=creators.filter(c=>c.category===section.id);
        if(!items.length)return null;
        return <section key={section.id} id={section.id} className="section"><div className="heading"><h2>{section.label}</h2><span>{items.length} live</span></div>
          <div className="grid">{items.map(c=><a className="card" href={'/go/'+encodeURIComponent(c.slug)} key={c.slug} rel="nofollow">
            <div className="photo">{c.imageUrl ? <img src={c.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer"/> : <span className="placeholder">{c.name.slice(0,1)}</span>}<span className="live">● LIVE</span></div>
            <div className="details"><strong>{c.name}</strong><span>{c.viewers ? c.viewers.toLocaleString()+' watching':'Live now'} <b>WATCH ↗</b></span></div>
          </a>)}</div></section>;
      })}
      {!creators.length&&<section className="section"><h2>No creators available right now</h2><p>Please check back when creators are online.</p></section>}
    </div>
  </main>;
}
