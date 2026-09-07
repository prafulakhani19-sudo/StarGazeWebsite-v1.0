export interface ResponsiveMedia {
  desktop: string;
  banner: string;
  mobile: string;
}

export const CLIENT_MEDIA: Record<string, ResponsiveMedia> = {
  'nayi-soch': {
    desktop: 'Nayi Soch 112 - 1920x1080.png',
    banner: 'Nayi Soch 112 1600x500.png',
    mobile: 'Nayi Soch 112 1080x1350.png',
  },
  'psycho': {
    desktop: 'physco 1920x1080.png',
    banner: 'physco 1600x500.png',
    mobile: 'physco 1080x1350.png',
  },
  'saheb-vikaskari': {
    desktop: 'Saheb Vikaskari - 1920x1080.png',
    banner: 'Saheb Vikaskari - 1600x500.png',
    mobile: 'Saheb Vikaskari - 1080x1350.png',
  },
  'father-son-duo': {
    desktop: 'Father & Son Duo 1920x1080.png',
    banner: 'Father & Son Duo 1600x500.png',
    mobile: 'Father & Son Duo 1080x1350.png',
  },
};

export function getProjectMedia(idOrTitle: string): ResponsiveMedia {
  const key = idOrTitle.toLowerCase();
  if (key.includes('nayi') || key.includes('soch')) return CLIENT_MEDIA['nayi-soch'];
  if (key.includes('psycho')) return CLIENT_MEDIA['psycho'];
  if (key.includes('saheb') || key.includes('vikas')) return CLIENT_MEDIA['saheb-vikaskari'];
  if (key.includes('father') || key.includes('duo') || key.includes('concert')) return CLIENT_MEDIA['father-son-duo'];
  
  // Default fallback to Nayi Soch
  return CLIENT_MEDIA['nayi-soch'];
}
