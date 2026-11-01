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

/**
 * Official Google Logo (Standard 4-color 'G' icon)
 */
export const GoogleLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Google Logo"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);
