export type CreatorCategory = 'men' | 'trans' | 'couples' | 'women';

export type Creator = {
  slug: string;
  externalId?: string;
  provider?: 'amateur' | 'sugarcams' | 'flirt4free' | 'stripchat' | 'cam4' | 'chaturbate';
  name: string;
  age: number | null;
  category: CreatorCategory;
  languages: string[];
  tags: string[];
  premium?: boolean;
  online: boolean;
  viewers: number;
  imageUrl?: string;
  videoUrl?: string;
  profileImageUrl?: string;
  destinationUrl?: string;
  country?: string;
  isHD?: boolean;
  isNew?: boolean;
  heroEligible?: boolean;
};

export const creators: Creator[] = [
  { slug: 'adrian', name: 'Adrian', age: 28, category: 'men', languages: ['Spanish', 'English'], tags: ['Latino', 'Fit'], premium: true, online: true, viewers: 1842 },
  { slug: 'marco', name: 'Marco', age: 31, category: 'men', languages: ['Italian', 'English'], tags: ['Mature', 'Fit'], premium: true, online: true, viewers: 1320 },
  { slug: 'leo', name: 'Leo', age: 25, category: 'men', languages: ['English'], tags: ['New', 'Athletic'], online: true, viewers: 876 },
  { slug: 'valentina', name: 'Valentina', age: 26, category: 'trans', languages: ['Spanish', 'English'], tags: ['Glam', 'Chatty'], online: true, viewers: 1654 },
  { slug: 'renata', name: 'Renata', age: 27, category: 'trans', languages: ['Portuguese', 'English'], tags: ['New', 'Flirty'], online: true, viewers: 1208 },
  { slug: 'alex-leo', name: 'Alex & Leo', age: 29, category: 'couples', languages: ['Spanish', 'English'], tags: ['Couple', 'Latino'], online: true, viewers: 2144 },
  { slug: 'nico-dani', name: 'Nico & Dani', age: 30, category: 'couples', languages: ['Spanish'], tags: ['Couple', 'Popular'], online: true, viewers: 973 },
  { slug: 'sofia', name: 'Sofia', age: 26, category: 'women', languages: ['Spanish', 'English'], tags: ['Latina', 'Popular'], online: true, viewers: 2360 },
  { slug: 'maya', name: 'Maya', age: 24, category: 'women', languages: ['English'], tags: ['Trending', 'New'], online: true, viewers: 1102 }
];

export function creatorsByCategory(category: CreatorCategory) {
  return creators.filter((creator) => creator.category === category);
}

export function creatorBySlug(slug: string) {
  return creators.find((creator) => creator.slug === slug);
}
