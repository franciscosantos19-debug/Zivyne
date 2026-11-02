import Link from 'next/link';
import { getAmateurCreators } from '@/lib/providers/amateur';
export const dynamic = 'force-dynamic';

const sections = [
  { id: 'men', label: 'Men' },
  { id: 'trans', label: 'Trans' },
  { id: 'women', label: 'Women' },
  { id: 'couples', label: 'Couples' }
] as const;

export default async function Home() {
  const creators = (await getAmateurCreators()).filter(c => c.online && c.provider === 'amateur');
  return <main>
    <header><div className="shell nav"><Link className="logo" href="/">ZIVYNE</Link><nav>{sections.map(s=><a key={s.id} href={'#'+s.id}>{s.label}</a>)}</nav></div></header>
    <section className="hero shell"><p className="eyebrow">EXCLUSIVELY AMATEUR.TV</p><h1>Discover who's live.</h1><p>Explore live adult creators by category. Updated from the Amateur.tv feed.</p></section>
    {sections.map(section => {
      const items = creators.filter(c=>c.category===section.id).sort((a,b)=>b.viewers-a.viewers);
      if (!items.length) return null;
      return <section key={section.id} id={section.id} className="shell section"><div className="heading"><h2>{section.label}</h2><span>{items.length} live</span></div>
        <div className="grid">{items.map(c=><a className="card" href={'/go/'+encodeURIComponent(c.slug)} key={c.slug} rel="nofollow">
          <div className="photo">{c.imageUrl ? <img src={c.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <span className="placeholder">{c.name.slice(0,1)}</span>}<span className="live">LIVE</span></div>
          <div className="details"><strong>{c.name}</strong><span>{c.viewers ? c.viewers.toLocaleString()+' watching':'Watch live'}</span></div>
        </a>)}</div>
      </section>;
    })}
    {!creators.length && <section className="shell section"><h2>No live creators available right now</h2><p>The provider feed may be temporarily unavailable.</p></section>}
  </main>;
}
