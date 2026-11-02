import type { Creator, CreatorCategory } from '@/lib/demoData';

const FEED_URL =
  process.env.AMATEUR_CAMS_FEED_URL ||
  'https://api.a00s.net/v3/cache/affiliates/camsfeed/json';

type UnknownRecord = Record<string, unknown>;

const HERO_EXPLICIT_TERMS = [
  'anal', 'asshole', 'blowjob', 'cock', 'cum', 'deepthroat', 'dick',
  'dildo', 'fisting', 'fuck', 'masturbat', 'penis', 'pussy', 'sex',
  'squirt', 'vagina'
];

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as UnknownRecord)
    : null;
}

function firstValue(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}

function asString(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim()) return value.trim();
  if (typeof value === 'number') return String(value);
  return undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value > 0;
  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'online', 'live', 'available'].includes(value.toLowerCase());
  }
  return false;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asString(item))
      .filter((item): item is string => Boolean(item));
  }
  if (typeof value === 'string') {
    return value
      .split(/[,|;]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function isHeroEligible(record: UnknownRecord, imageUrl?: string) {
  if (!imageUrl) return false;

  const raw = asStringArray(
    firstValue(record, ['tags', 'tagsOnline', 'labels', 'keywords', 'interests', 'topic'])
  ).map((item) => item.toLowerCase());

  return !raw.some((tag) =>
    HERO_EXPLICIT_TERMS.some((term) => tag.includes(term))
  );
}

function normalizeAge(value: unknown): number | null {
  const age = Math.floor(asNumber(value) || 0);
  return age >= 18 && age <= 80 ? age : null;
}

function normalizeCategory(record: UnknownRecord): CreatorCategory | null {
  const source = asString(
    firstValue(record, [
      'gender',
      'sex',
      'model_gender',
      'modelGender',
      'performerGender',
      'genre',
      'category',
      'type'
    ])
  )?.toLowerCase();

  if (!source) return null;

  const normalized = source.replace(/[^a-z]+/g, ' ').trim();

  if (['t', 'trans', 'transgender', 'transsexual', 'ts', 'shemale'].includes(normalized)) return 'trans';
  if (['c', 'couple', 'couples', 'duo', 'pair'].includes(normalized)) return 'couples';
  if (['f', 'female', 'woman', 'women', 'girl'].includes(normalized)) return 'women';
  if (['m', 'male', 'man', 'men', 'boy', 'guy'].includes(normalized)) return 'men';

  if (/\b(trans|transgender|transsexual|shemale)\b/.test(normalized)) return 'trans';
  if (/\b(couple|couples|duo|pair)\b/.test(normalized)) return 'couples';
  if (/\b(female|woman|women|girl)\b/.test(normalized)) return 'women';
  if (/\b(male|man|men|boy|guy)\b/.test(normalized)) return 'men';

  return null;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}

function locateRecords(payload: unknown): UnknownRecord[] {
  if (Array.isArray(payload)) {
    return payload.map(asRecord).filter((item): item is UnknownRecord => Boolean(item));
  }

  const root = asRecord(payload);
  if (!root) return [];

  const likelyKeys = ['data', 'cams', 'models', 'items', 'results', 'records', 'performers', 'content'];
  for (const key of likelyKeys) {
    const value = root[key];
    if (Array.isArray(value)) {
      return value.map(asRecord).filter((item): item is UnknownRecord => Boolean(item));
    }
    const nested = asRecord(value);
    if (nested) {
      const nestedRecords = locateRecords(nested);
      if (nestedRecords.length) return nestedRecords;
    }
  }

  for (const value of Object.values(root)) {
    if (Array.isArray(value)) {
      const records = value.map(asRecord).filter((item): item is UnknownRecord => Boolean(item));
      if (records.length) return records;
    }
  }

  return [];
}

function normalizeCreator(record: UnknownRecord, index: number): Creator | null {
  const name =
    asString(
      firstValue(record, [
        'username',
        'userName',
        'nickname',
        'nick',
        'display_name',
        'displayName',
        'modelName',
        'name',
        'performer'
      ])
    ) || '';

  const category = normalizeCategory(record);
  if (!name || !category) return null;

  const rawExternalId = asString(
    firstValue(record, ['id', 'user_id', 'userId', 'model_id', 'modelId', 'uuid'])
  );
  const externalId = rawExternalId || slugify(name);

  const imageUrl = asString(
    firstValue(record, [
      'image',
      'image_url',
      'imageUrl',
      'preview',
      'preview_url',
      'previewUrl',
      'imageCapture',
      'thumbnail',
      'thumbnail_url',
      'thumbnailUrl',
      'picture',
      'photo',
      'snapshot',
      'screenshot'
    ])
  );

  const profileImageUrl = asString(
    firstValue(record, [
      'image_full',
      'imageFull',
      'full_image',
      'fullImage',
      'image_large',
      'imageLarge',
      'large_image',
      'largeImage',
      'picture_large',
      'pictureLarge',
      'imageCapture',
      'image_capture',
      'image',
      'image_url',
      'imageUrl'
    ])
  ) || imageUrl;

  const destinationUrl = asString(
    firstValue(record, ['url', 'camUrl', 'cam_url', 'profileUrl', 'profile_url', 'link'])
  );

  const languages = asStringArray(
    firstValue(record, ['languages', 'language', 'langs', 'camLang', 'spoken_languages', 'spokenLanguages'])
  );

  const tags = asStringArray(firstValue(record, ['tags', 'tagsOnline', 'labels', 'keywords', 'interests', 'topic']));

  const status = firstValue(record, ['online', 'is_online', 'isOnline', 'live', 'isLive', 'status']);

  return {
    slug: rawExternalId
      ? `${slugify(name)}-${slugify(rawExternalId)}`.slice(0, 100)
      : slugify(name),
    externalId,
    provider: 'amateur',
    name,
    age: normalizeAge(firstValue(record, ['age'])),
    category,
    languages: languages.length ? languages.slice(0, 4) : ['Live'],
    tags: tags.slice(0, 5),
    premium: false,
    online: status === undefined ? true : asBoolean(status),
    viewers: Math.max(
      0,
      Math.floor(
        asNumber(
          firstValue(record, ['viewers', 'viewer_count', 'viewerCount', 'users', 'watchers', 'audience'])
        ) || 0
      )
    ),
    imageUrl,
    profileImageUrl,
    destinationUrl,
    isHD: asBoolean(firstValue(record, ['is_hd', 'isHD', 'hd', 'highDefinition'])),
    heroEligible: category !== 'couples' && isHeroEligible(record, imageUrl)
  };
}

async function fetchAmateurCreators(revalidate: number): Promise<Creator[]> {
  try {
    const response = await fetch(FEED_URL, {
      headers: { Accept: 'application/json' },
      next: { revalidate },
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok) {
      throw new Error(`feed returned HTTP ${response.status}`);
    }

    const payload: unknown = await response.json();
    const records = locateRecords(payload);

    return records
      .map(normalizeCreator)
      .filter((item): item is Creator => Boolean(item))
      .filter((item) => item.online);
  } catch (error) {
    console.warn(
      '[MISTYRE] Amateur feed unavailable:',
      error instanceof Error ? error.message : String(error)
    );
    return [];
  }
}

export async function getAmateurCreators(): Promise<Creator[]> {
  return fetchAmateurCreators(60);
}

export async function getAmateurHeroCreators(): Promise<Creator[]> {
  const creators = await fetchAmateurCreators(15);
  return creators.filter(
    (creator) => creator.heroEligible && creator.imageUrl && creator.category !== 'couples'
  );
}

export function buildAmateurAffiliateUrl(creator?: Creator) {
  const raw =
    process.env.AMATEUR_AFFILIATE_URL ||
    'https://y.iw0.net/r/K64naxq/';

  const url = new URL(raw);
  const affiliateId = process.env.AMATEUR_AFFILIATE_ID;
  if (affiliateId && !url.searchParams.has('a')) url.searchParams.set('a', affiliateId);

  url.searchParams.set('utm_source', 'mistyre');
  url.searchParams.set('utm_medium', 'affiliate');
  if (creator) {
    url.searchParams.set('utm_campaign', creator.category);
    url.searchParams.set('utm_creative', creator.slug);
  }

  return url.toString();
}
