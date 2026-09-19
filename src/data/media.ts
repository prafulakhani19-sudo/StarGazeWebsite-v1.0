export interface StargazeMedia {
  id: string;
  title: string;
  category:
    | "HERO"
    | "WORK"
    | "EVENTS"
    | "EQUIPMENT"
    | "TEAM"
    | "PARTNERS"
    | "NEWSROOM"
    | "GENERAL";
  project?: string;
  variant?: "DESKTOP" | "WIDE" | "MOBILE" | "THUMBNAIL";
  src: string;
  alt: string;
  width?: number;
  height?: number;
  active: boolean;
  installed: boolean; // Truthful physical file check flag
}

export const STARGAZE_MEDIA_REGISTRY: StargazeMedia[] = [
  // --- HERO / WORK ASSETS ---
  {
    id: "nayi-soch-desktop",
    title: "Nayi Soch (112)",
    category: "HERO",
    project: "NAYI SOCH",
    variant: "DESKTOP",
    src: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=75",
    alt: "Nayi Soch 112 Desktop Poster",
    width: 1920,
    height: 1080,
    active: true,
    installed: true,
  },
  {
    id: "nayi-soch-wide",
    title: "Nayi Soch (112) Cinematic",
    category: "WORK",
    project: "NAYI SOCH",
    variant: "WIDE",
    src: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1600&h=500&q=75",
    alt: "Nayi Soch 112 Cinematic Banner",
    width: 1600,
    height: 500,
    active: true,
    installed: true,
  },
  {
    id: "nayi-soch-mobile",
    title: "Nayi Soch (112) Mobile",
    category: "WORK",
    project: "NAYI SOCH",
    variant: "MOBILE",
    src: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1080&h=1350&q=75",
    alt: "Nayi Soch 112 Mobile Portrait",
    width: 1080,
    height: 1350,
    active: true,
    installed: true,
  },

  {
    id: "psycho-desktop",
    title: "Psycho (Samjo To)",
    category: "HERO",
    project: "PSYCHO",
    variant: "DESKTOP",
    src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=75",
    alt: "Psycho Psychological Drama Desktop",
    width: 1920,
    height: 1080,
    active: true,
    installed: true,
  },
  {
    id: "psycho-wide",
    title: "Psycho Cinematic",
    category: "WORK",
    project: "PSYCHO",
    variant: "WIDE",
    src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&h=500&q=75",
    alt: "Psycho Cinematic Banner",
    width: 1600,
    height: 500,
    active: true,
    installed: true,
  },
  {
    id: "psycho-mobile",
    title: "Psycho Mobile",
    category: "WORK",
    project: "PSYCHO",
    variant: "MOBILE",
    src: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1080&h=1350&q=75",
    alt: "Psycho Mobile Portrait",
    width: 1080,
    height: 1350,
    active: true,
    installed: true,
  },

  {
    id: "saheb-vikaskari-desktop",
    title: "Saheb Vikaskari",
    category: "HERO",
    project: "SAHEB VIKAS KARI",
    variant: "DESKTOP",
    src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=75",
    alt: "Saheb Vikaskari Feature Film Desktop",
    width: 1920,
    height: 1080,
    active: true,
    installed: true,
  },
  {
    id: "saheb-vikaskari-wide",
    title: "Saheb Vikaskari Cinematic",
    category: "WORK",
    project: "SAHEB VIKAS KARI",
    variant: "WIDE",
    src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&h=500&q=75",
    alt: "Saheb Vikaskari Cinematic Banner",
    width: 1600,
    height: 500,
    active: true,
    installed: true,
  },
  {
    id: "saheb-vikaskari-mobile",
    title: "Saheb Vikaskari Mobile",
    category: "WORK",
    project: "SAHEB VIKAS KARI",
    variant: "MOBILE",
    src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1080&h=1350&q=75",
    alt: "Saheb Vikaskari Mobile Portrait",
    width: 1080,
    height: 1350,
    active: true,
    installed: true,
  },

  {
    id: "father-son-desktop",
    title: "Father & Son Duo Live in Concert",
    category: "HERO",
    project: "FATHER & SON DUO",
    variant: "DESKTOP",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=75",
    alt: "Father & Son Duo Live in Concert Desktop",
    width: 1920,
    height: 1080,
    active: true,
    installed: true,
  },
  {
    id: "father-son-wide",
    title: "Father & Son Duo Cinematic",
    category: "EVENTS",
    project: "FATHER & SON DUO",
    variant: "WIDE",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&h=500&q=75",
    alt: "Father & Son Duo Cinematic Banner",
    width: 1600,
    height: 500,
    active: true,
    installed: true,
  },
  {
    id: "father-son-mobile",
    title: "Father & Son Duo Mobile",
    category: "EVENTS",
    project: "FATHER & SON DUO",
    variant: "MOBILE",
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1080&h=1350&q=75",
    alt: "Father & Son Duo Mobile Portrait",
    width: 1080,
    height: 1350,
    active: true,
    installed: true,
  },

  // --- EQUIPMENT ASSETS ---
  {
    id: "eq-arri-alexa",
    title: "ARRI Alexa Mini / SXT Package",
    category: "EQUIPMENT",
    project: "CAMERA",
    variant: "THUMBNAIL",
    src: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?auto=format&fit=crop&w=800&q=75",
    alt: "ARRI Alexa Mini Cinema Camera",
    width: 800,
    height: 600,
    active: true,
    installed: true,
  },
  {
    id: "eq-sony-venice",
    title: "Sony Venice 1 & FX6 Cine Rig",
    category: "EQUIPMENT",
    project: "CAMERA",
    variant: "THUMBNAIL",
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=75",
    alt: "Sony Venice Cine Rig",
    width: 800,
    height: 600,
    active: true,
    installed: true,
  },
  {
    id: "eq-ultra-primes",
    title: "Ultra Prime & Sigma Prime Glass Set",
    category: "EQUIPMENT",
    project: "LENS",
    variant: "THUMBNAIL",
    src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=75",
    alt: "Ultra Prime Lenses",
    width: 800,
    height: 600,
    active: true,
    installed: true,
  },
  {
    id: "eq-optimo-zoom",
    title: "Optimo Zoom & Alura Zoom Rig",
    category: "EQUIPMENT",
    project: "LENS",
    variant: "THUMBNAIL",
    src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=75",
    alt: "Optimo Zoom Rig",
    width: 800,
    height: 600,
    active: true,
    installed: true,
  },

  // --- TEAM ASSETS ---
  {
    id: "team-nikhil",
    title: "Nikhil Vasantrao Shirbhate",
    category: "TEAM",
    project: "DIRECTOR",
    variant: "THUMBNAIL",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=75",
    alt: "Nikhil Vasantrao Shirbhate - Director",
    width: 800,
    height: 800,
    active: true,
    installed: true,
  },
  {
    id: "team-satish",
    title: "Satish Tulshiramji Mohod",
    category: "TEAM",
    project: "PRODUCER",
    variant: "THUMBNAIL",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=75",
    alt: "Satish Tulshiramji Mohod - Producer",
    width: 800,
    height: 800,
    active: true,
    installed: true,
  },

  // --- PARTNERS / GENERAL ---
  {
    id: "partner-orange-city",
    title: "Orange City Production",
    category: "PARTNERS",
    variant: "THUMBNAIL",
    src: "https://images.unsplash.com/photo-1533488765986-dfa2a9939acd?auto=format&fit=crop&w=400&q=75",
    alt: "Orange City Production Logo",
    width: 400,
    height: 200,
    active: true,
    installed: true,
  },
  {
    id: "partner-nagpur-police",
    title: "Nagpur Police Collaboration",
    category: "PARTNERS",
    variant: "THUMBNAIL",
    src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=75",
    alt: "Nagpur Police Logo",
    width: 400,
    height: 200,
    active: true,
    installed: true,
  },
];

export const STARGAZE_LOGO_PATH = '/assets/stargaze/brand/stargaze-logo.png';
export const STARGAZE_FAVICON_PATH = '/assets/stargaze/brand/stargaze-favicon.png';

export interface ResponsiveMedia {
  desktop: string;
  banner: string;
  mobile: string;
}

export const CLIENT_MEDIA: Record<string, ResponsiveMedia> = {
  'nayi-soch': {
    desktop: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1920&q=75',
    banner: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1600&h=500&q=75',
    mobile: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=1080&h=1350&q=75',
  },
  'psycho': {
    desktop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1920&q=75',
    banner: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&h=500&q=75',
    mobile: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1080&h=1350&q=75',
  },
  'saheb-vikaskari': {
    desktop: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1920&q=75',
    banner: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&h=500&q=75',
    mobile: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1080&h=1350&q=75',
  },
  'father-son-duo': {
    desktop: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=75',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&h=500&q=75',
    mobile: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1080&h=1350&q=75',
  },
};

export function getProjectMedia(idOrTitle: string): ResponsiveMedia {
  const key = idOrTitle.toLowerCase();
  if (key.includes('nayi') || key.includes('soch')) return CLIENT_MEDIA['nayi-soch'];
  if (key.includes('psycho')) return CLIENT_MEDIA['psycho'];
  if (key.includes('saheb') || key.includes('vikas')) return CLIENT_MEDIA['saheb-vikaskari'];
  if (key.includes('father') || key.includes('duo') || key.includes('concert')) return CLIENT_MEDIA['father-son-duo'];
  
  return CLIENT_MEDIA['nayi-soch'];
}

