import { redirect } from 'next/navigation';
// Unknown legacy links lead to a valid ZIVYNE page rather than a 404.
export default function LegacyFallback() { redirect('/'); }
