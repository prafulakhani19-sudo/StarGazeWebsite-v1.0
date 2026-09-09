import React, { useState } from 'react';

interface StargazeHorizontalLogoProps {
  className?: string;
  customLogoUrl?: string;
  alt?: string;
  height?: number | string;
  variant?: 'light' | 'dark' | 'auto';
}

export const StargazeHorizontalLogo: React.FC<StargazeHorizontalLogoProps> = ({
  className = 'h-10 sm:h-12 w-auto',
  customLogoUrl,
  alt = 'Stargaze Media - We Create What The World Watches',
  height,
  variant = 'auto',
}) => {
  const [imgError, setImgError] = useState(false);

  // If a custom image URL is provided from CMS and hasn't errored, render it directly with no borders
  if (customLogoUrl && !imgError) {
    return (
      <img
        src={customLogoUrl}
        alt={alt}
        className={`${className} object-contain transition-transform duration-300 hover:scale-[1.02]`}
        style={height ? { height } : undefined}
        onError={() => setImgError(true)}
      />
    );
  }

  // Built-in pristine horizontal vector logo matching official Stargaze luxury emblem & typography
  return (
    <svg
      viewBox="0 0 780 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} object-contain transition-transform duration-300 hover:scale-[1.02] select-none`}
      style={height ? { height } : undefined}
      aria-label={alt}
      role="img"
    >
      <defs>
        {/* Rich 3D Gold Gradients */}
        <linearGradient id="gold-emblem-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5D061" />
          <stop offset="25%" stopColor="#E5B239" />
          <stop offset="50%" stopColor="#B37D14" />
          <stop offset="75%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#8C5C05" />
        </linearGradient>

        <linearGradient id="gold-emblem-inner" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8A5A08" />
          <stop offset="35%" stopColor="#D99B26" />
          <stop offset="70%" stopColor="#FCE588" />
          <stop offset="100%" stopColor="#664103" />
        </linearGradient>

        <linearGradient id="gold-text-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4A03C" />
          <stop offset="30%" stopColor="#FBE38E" />
          <stop offset="55%" stopColor="#B8831A" />
          <stop offset="85%" stopColor="#8F5E08" />
          <stop offset="100%" stopColor="#C4902B" />
        </linearGradient>

        <linearGradient id="gold-flare-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
        </linearGradient>

        <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* ---------------- 1. FILM-RIBBON 'S' EMBLEM ---------------- */}
      <g transform="translate(10, 0)">
        {/* Outer Ribbon Swirl */}
        <path
          d="M130,35 C175,60 170,120 120,150 C75,178 30,155 30,135 C30,120 50,110 65,120 C85,133 115,130 135,115 C160,95 150,55 105,45 C65,35 45,70 45,100 C45,135 75,175 125,170 C165,166 185,130 175,85 C168,55 145,30 115,20 C80,10 40,40 40,85 C40,130 85,175 140,165 C170,160 188,135 180,105 C175,85 160,70 145,78 C135,83 138,98 142,108 C148,122 135,145 110,148 C80,152 58,125 58,95 C58,65 80,30 120,28 Z"
          fill="url(#gold-emblem-main)"
          filter="url(#gold-glow)"
          opacity="0.95"
        />

        {/* Inner Film Strip Ribbon Curve */}
        <path
          d="M48,70 C52,40 85,25 122,30 C155,35 178,65 170,105 C162,145 125,170 85,165 C55,160 38,135 42,108 C46,80 72,62 102,68 C128,74 140,95 136,118 C132,138 112,150 90,146 C75,142 66,128 72,115 C76,105 88,102 96,108 C105,115 118,110 122,98 C126,82 112,72 95,70 C70,68 55,85 52,105 C48,130 68,155 100,158 C135,162 165,135 168,98 C172,60 145,35 110,32 C80,30 52,45 48,70 Z"
          fill="url(#gold-emblem-inner)"
        />

        {/* Film Sprocket Perforations Along The Ribbon */}
        <g fill="#271804" opacity="0.85">
          <rect x="42" y="80" width="5" height="7" rx="1.5" transform="rotate(-15 42 80)" />
          <rect x="47" y="98" width="5" height="7" rx="1.5" transform="rotate(-5 47 98)" />
          <rect x="56" y="118" width="5" height="7" rx="1.5" transform="rotate(15 56 118)" />
          <rect x="72" y="138" width="5" height="7" rx="1.5" transform="rotate(35 72 138)" />
          <rect x="94" y="150" width="5" height="7" rx="1.5" transform="rotate(10 94 150)" />
          <rect x="116" y="148" width="5" height="7" rx="1.5" transform="rotate(-15 116 148)" />
          <rect x="135" y="135" width="5" height="7" rx="1.5" transform="rotate(-35 135 135)" />
          <rect x="146" y="115" width="5" height="7" rx="1.5" transform="rotate(-65 146 115)" />
          
          <rect x="68" y="42" width="5" height="7" rx="1.5" transform="rotate(25 68 42)" />
          <rect x="88" y="32" width="5" height="7" rx="1.5" transform="rotate(5 88 32)" />
          <rect x="110" y="31" width="5" height="7" rx="1.5" transform="rotate(-10 110 31)" />
          <rect x="132" y="38" width="5" height="7" rx="1.5" transform="rotate(-30 132 38)" />
          <rect x="150" y="52" width="5" height="7" rx="1.5" transform="rotate(-50 150 52)" />
        </g>

        {/* Radiant Starburst Flare on Top-Right Edge of Emblem */}
        <g transform="translate(162, 54)">
          {/* Vertical & Horizontal Rays */}
          <line x1="-38" y1="0" x2="38" y2="0" stroke="url(#gold-flare-grad)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="0" y1="-38" x2="0" y2="38" stroke="url(#gold-flare-grad)" strokeWidth="2.5" strokeLinecap="round" />
          {/* Diagonal Rays */}
          <line x1="-18" y1="-18" x2="18" y2="18" stroke="url(#gold-flare-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
          <line x1="18" y1="-18" x2="-18" y2="18" stroke="url(#gold-flare-grad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
          {/* Center Intense Core */}
          <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" filter="url(#gold-glow)" />
          <circle cx="0" cy="0" r="2.5" fill="#FFFBEB" />
        </g>
      </g>

      {/* ---------------- 2. "STARGAZE" TYPOGRAPHY ---------------- */}
      <g transform="translate(230, 0)">
        {/* Main Brand Title - STARGAZE */}
        <text
          x="0"
          y="112"
          fontFamily="'Cinzel', 'Playfair Display', 'Didot', 'Georgia', serif"
          fontSize="76"
          fontWeight="800"
          letterSpacing="0.16em"
          fill="url(#gold-text-grad)"
          style={{ textTransform: 'uppercase' }}
        >
          STARGAZE
        </text>

        {/* TM Symbol */}
        <text
          x="512"
          y="68"
          fontFamily="'Cinzel', 'Inter', sans-serif"
          fontSize="14"
          fontWeight="700"
          fill="#B37D14"
        >
          TM
        </text>

        {/* ---------------- 3. "M E D I A" SUB-HEADER ---------------- */}
        <text
          x="148"
          y="152"
          fontFamily="'Cinzel', 'Playfair Display', 'Georgia', serif"
          fontSize="24"
          fontWeight="700"
          letterSpacing="0.65em"
          fill="#8A5A08"
          style={{ textTransform: 'uppercase' }}
        >
          MEDIA
        </text>

        {/* ---------------- 4. TAGLINE: WE CREATE WHAT THE WORLD WATCHES ---------------- */}
        <text
          x="12"
          y="184"
          fontFamily="'Inter', 'Montserrat', 'Helvetica Neue', sans-serif"
          fontSize="10.5"
          fontWeight="600"
          letterSpacing="0.38em"
          fill="#A16207"
          opacity="0.9"
          style={{ textTransform: 'uppercase' }}
        >
          WE CREATE WHAT THE WORLD WATCHES
        </text>
      </g>
    </svg>
  );
};
