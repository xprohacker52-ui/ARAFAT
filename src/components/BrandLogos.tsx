import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

/**
 * Official Facebook Logo (Hex: #1877F2 with white 'f')
 */
export const FacebookLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Facebook Logo"
  >
    <circle cx="24" cy="24" r="24" fill="#1877F2" />
    <path
      d="M29.5 24.8L30.2 20.3H25.9V17.4C25.9 16.1 26.5 14.9 28.5 14.9H30.5V11C30.5 11 28.7 10.7 27 10.7C23.4 10.7 21.1 12.9 21.1 16.9V20.3H17.2V24.8H21.1V36.7C22.7 37 24.3 37.1 25.9 36.7V24.8H29.5Z"
      fill="white"
    />
  </svg>
);

/**
 * Official Instagram Logo (Signature Vibrant Gradient + White Camera Outline & Lens)
 */
export const InstagramLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Instagram Logo"
  >
    <defs>
      <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f09433" />
        <stop offset="25%" stopColor="#e6683c" />
        <stop offset="50%" stopColor="#dc2743" />
        <stop offset="75%" stopColor="#cc2366" />
        <stop offset="100%" stopColor="#bc1888" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="13" fill="url(#igGradient)" />
    {/* Outer Camera Contour */}
    <rect
      x="11"
      y="11"
      width="26"
      height="26"
      rx="7.5"
      stroke="white"
      strokeWidth="2.8"
      fill="none"
    />
    {/* Inner Center Lens */}
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="2.8" fill="none" />
    {/* Flash Dot */}
    <circle cx="31.2" cy="16.8" r="1.5" fill="white" />
  </svg>
);

/**
 * Official Netflix Iconic 'N' Ribbon Logo (Hex: #E50914)
 */
export const NetflixLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 32 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Netflix Logo"
  >
    {/* Left vertical red ribbon */}
    <path
      d="M0 0H8.8V44.4C6 45.4 3 46.2 0 47V0Z"
      fill="#B81D24"
    />
    {/* Right vertical red ribbon */}
    <path
      d="M23.2 0H32V47C29 46.2 26 45.4 23.2 44.4V0Z"
      fill="#B81D24"
    />
    {/* Diagonal bright red ribbon with shadow angle */}
    <path
      d="M0 0H8.8L32 47H23.2L0 0Z"
      fill="#E50914"
      filter="drop-shadow(-2px 0px 4px rgba(0,0,0,0.5))"
    />
  </svg>
);

/**
 * Official Crunchyroll Logo (Crunchyroll Orange #F47521 iconic anime eye)
 */
export const CrunchyrollLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 48 48"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Crunchyroll Logo"
  >
    <circle cx="24" cy="24" r="24" fill="#F47521" />
    {/* Outer white crescent eye */}
    <path
      d="M24 8C15.16 8 8 15.16 8 24C8 32.84 15.16 40 24 40C29.42 40 34.22 37.3 37.16 33.16C36.04 33.46 34.86 33.62 33.64 33.62C23.76 33.62 15.74 25.6 15.74 15.72C15.74 12.82 16.44 10.08 17.68 7.68C19.68 8.16 21.78 8.44 24 8Z"
      fill="#FFFFFF"
    />
    {/* Inner eye pupil */}
    <circle cx="24" cy="24" r="7.5" fill="#23252B" />
    {/* Pupil highlight */}
    <circle cx="26.5" cy="21.5" r="2.8" fill="#FFFFFF" />
  </svg>
);

/**
 * Official bKash Logo (Origami Bird Symbol + Magenta #E2136E)
 */
export const BkashLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="bKash Logo"
  >
    <rect width="100" height="100" rx="20" fill="#E2136E" />
    {/* bKash Origami Bird */}
    <path
      d="M26 48L64 22L54 52L26 48Z"
      fill="#FFFFFF"
    />
    <path
      d="M54 52L78 38L66 66L54 52Z"
      fill="#FEE6F0"
    />
    <path
      d="M26 48L54 52L36 78L26 48Z"
      fill="#FFFFFF"
    />
    <path
      d="M36 78L54 52L66 66L36 78Z"
      fill="#FFFFFF"
    />
    <path
      d="M66 66L78 38L82 62L66 66Z"
      fill="#FAD2E4"
    />
  </svg>
);

/**
 * Official Nagad Logo (Signature Warm Orange to Crimson gradient with Taka emblem)
 */
export const NagadLogo: React.FC<LogoProps> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 100 100"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Nagad Logo"
  >
    <defs>
      <linearGradient id="nagadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F7941D" />
        <stop offset="100%" stopColor="#EE4036" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="20" fill="url(#nagadGrad)" />
    {/* Bengali Taka sign ৳ */}
    <text
      x="50"
      y="66"
      textAnchor="middle"
      fill="white"
      fontSize="52"
      fontWeight="900"
      fontFamily="sans-serif"
    >
      ৳
    </text>
  </svg>
);
