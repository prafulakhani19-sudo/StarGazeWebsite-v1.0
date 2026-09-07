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
    src: "/assets/stargaze/hero/nayi-soch-1920x1080.png",
    alt: "Nayi Soch 112 Desktop Poster",
    width: 1920,
    height: 1080,
    active: true,
    installed: false,
  },
  {
    id: "nayi-soch-wide",
    title: "Nayi Soch (112) Cinematic",
    category: "WORK",
    project: "NAYI SOCH",
    variant: "WIDE",
    src: "/assets/stargaze/work/nayi-soch-1600x500.png",
    alt: "Nayi Soch 112 Cinematic Banner",
    width: 1600,
    height: 500,
    active: true,
    installed: false,
  },
  {
    id: "nayi-soch-mobile",
    title: "Nayi Soch (112) Mobile",
    category: "WORK",
    project: "NAYI SOCH",
    variant: "MOBILE",
    src: "/assets/stargaze/work/nayi-soch-1080x1350.png",
    alt: "Nayi Soch 112 Mobile Portrait",
    width: 1080,
    height: 1350,
    active: true,
    installed: false,
  },

  {
    id: "psycho-desktop",
    title: "Psycho (Samjo To)",
    category: "HERO",
    project: "PSYCHO",
    variant: "DESKTOP",
    src: "/assets/stargaze/hero/psycho-1920x1080.png",
    alt: "Psycho Psychological Drama Desktop",
    width: 1920,
    height: 1080,
    active: true,
    installed: false,
  },
  {
    id: "psycho-wide",
    title: "Psycho Cinematic",
    category: "WORK",
    project: "PSYCHO",
    variant: "WIDE",
    src: "/assets/stargaze/work/psycho-1600x500.png",
    alt: "Psycho Cinematic Banner",
    width: 1600,
    height: 500,
    active: true,
    installed: false,
  },
  {
    id: "psycho-mobile",
    title: "Psycho Mobile",
    category: "WORK",
    project: "PSYCHO",
    variant: "MOBILE",
    src: "/assets/stargaze/work/psycho-1080x1350.png",
    alt: "Psycho Mobile Portrait",
    width: 1080,
    height: 1350,
    active: true,
    installed: false,
  },

  {
    id: "saheb-vikaskari-desktop",
    title: "Saheb Vikaskari",
    category: "HERO",
    project: "SAHEB VIKAS KARI",
    variant: "DESKTOP",
    src: "/assets/stargaze/hero/saheb-vikaskari-1920x1080.png",
    alt: "Saheb Vikaskari Feature Film Desktop",
    width: 1920,
    height: 1080,
    active: true,
    installed: false,
  },
  {
    id: "saheb-vikaskari-wide",
    title: "Saheb Vikaskari Cinematic",
    category: "WORK",
    project: "SAHEB VIKAS KARI",
    variant: "WIDE",
    src: "/assets/stargaze/work/saheb-vikaskari-1600x500.png",
    alt: "Saheb Vikaskari Cinematic Banner",
    width: 1600,
    height: 500,
    active: true,
    installed: false,
  },
  {
    id: "saheb-vikaskari-mobile",
    title: "Saheb Vikaskari Mobile",
    category: "WORK",
    project: "SAHEB VIKAS KARI",
    variant: "MOBILE",
    src: "/assets/stargaze/work/saheb-vikaskari-1080x1350.png",
    alt: "Saheb Vikaskari Mobile Portrait",
    width: 1080,
    height: 1350,
    active: true,
    installed: false,
  },

  {
    id: "father-son-desktop",
    title: "Father & Son Duo Live in Concert",
    category: "HERO",
    project: "FATHER & SON DUO",
    variant: "DESKTOP",
    src: "/assets/stargaze/hero/father-son-duo-1920x1080.png",
    alt: "Father & Son Duo Live in Concert Desktop",
    width: 1920,
    height: 1080,
    active: true,
    installed: false,
  },
  {
    id: "father-son-wide",
    title: "Father & Son Duo Cinematic",
    category: "EVENTS",
    project: "FATHER & SON DUO",
    variant: "WIDE",
    src: "/assets/stargaze/events/father-son-duo-1600x500.png",
    alt: "Father & Son Duo Cinematic Banner",
    width: 1600,
    height: 500,
    active: true,
    installed: false,
  },
  {
    id: "father-son-mobile",
    title: "Father & Son Duo Mobile",
    category: "EVENTS",
    project: "FATHER & SON DUO",
    variant: "MOBILE",
    src: "/assets/stargaze/events/father-son-duo-1080x1350.png",
    alt: "Father & Son Duo Mobile Portrait",
    width: 1080,
    height: 1350,
    active: true,
    installed: false,
  },

  // --- EQUIPMENT ASSETS ---
  {
    id: "eq-arri-alexa",
    title: "ARRI Alexa Mini / SXT Package",
    category: "EQUIPMENT",
    project: "CAMERA",
    variant: "THUMBNAIL",
    src: "/assets/stargaze/equipment/arri-alexa.png",
    alt: "ARRI Alexa Mini Cinema Camera",
    width: 800,
    height: 600,
    active: true,
    installed: false,
  },
  {
    id: "eq-sony-venice",
    title: "Sony Venice 1 & FX6 Cine Rig",
    category: "EQUIPMENT",
    project: "CAMERA",
    variant: "THUMBNAIL",
    src: "/assets/stargaze/equipment/sony-venice.png",
    alt: "Sony Venice Cine Rig",
    width: 800,
    height: 600,
    active: true,
    installed: false,
  },
  {
    id: "eq-ultra-primes",
    title: "Ultra Prime & Sigma Prime Glass Set",
    category: "EQUIPMENT",
    project: "LENS",
    variant: "THUMBNAIL",
    src: "/assets/stargaze/equipment/ultra-primes.png",
    alt: "Ultra Prime Lenses",
    width: 800,
    height: 600,
    active: true,
    installed: false,
  },
  {
    id: "eq-optimo-zoom",
    title: "Optimo Zoom & Alura Zoom Rig",
    category: "EQUIPMENT",
    project: "LENS",
    variant: "THUMBNAIL",
    src: "/assets/stargaze/equipment/optimo-zoom.png",
    alt: "Optimo Zoom Rig",
    width: 800,
    height: 600,
    active: true,
    installed: false,
  },

  // --- TEAM ASSETS ---
  {
    id: "team-nikhil",
    title: "Nikhil Vasantrao Shirbhate",
    category: "TEAM",
    project: "DIRECTOR",
    variant: "THUMBNAIL",
    src: "/assets/stargaze/team/nikhil-shirbhate.png",
    alt: "Nikhil Vasantrao Shirbhate - Director",
    width: 800,
    height: 800,
    active: true,
    installed: false,
  },
  {
    id: "team-satish",
    title: "Satish Tulshiramji Mohod",
    category: "TEAM",
    project: "PRODUCER",
    variant: "THUMBNAIL",
    src: "/assets/stargaze/team/satish-mohod.png",
    alt: "Satish Tulshiramji Mohod - Producer",
    width: 800,
    height: 800,
    active: true,
    installed: false,
  },

  // --- PARTNERS / GENERAL ---
  {
    id: "partner-orange-city",
    title: "Orange City Production",
    category: "PARTNERS",
    variant: "THUMBNAIL",
    src: "/assets/stargaze/partners/orange-city-production.png",
    alt: "Orange City Production Logo",
    width: 400,
    height: 200,
    active: true,
    installed: false,
  },
  {
    id: "partner-nagpur-police",
    title: "Nagpur Police Collaboration",
    category: "PARTNERS",
    variant: "THUMBNAIL",
    src: "/assets/stargaze/partners/nagpur-police.png",
    alt: "Nagpur Police Logo",
    width: 400,
    height: 200,
    active: true,
    installed: false,
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
    desktop: '/assets/stargaze/hero/nayi-soch-1920x1080.png',
    banner: '/assets/stargaze/work/nayi-soch-1600x500.png',
    mobile: '/assets/stargaze/work/nayi-soch-1080x1350.png',
  },
  'psycho': {
    desktop: '/assets/stargaze/hero/psycho-1920x1080.png',
    banner: '/assets/stargaze/work/psycho-1600x500.png',
    mobile: '/assets/stargaze/work/psycho-1080x1350.png',
  },
  'saheb-vikaskari': {
    desktop: '/assets/stargaze/hero/saheb-vikaskari-1920x1080.png',
    banner: '/assets/stargaze/work/saheb-vikaskari-1600x500.png',
    mobile: '/assets/stargaze/work/saheb-vikaskari-1080x1350.png',
  },
  'father-son-duo': {
    desktop: '/assets/stargaze/hero/father-son-duo-1920x1080.png',
    banner: '/assets/stargaze/events/father-son-duo-1600x500.png',
    mobile: '/assets/stargaze/events/father-son-duo-1080x1350.png',
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
