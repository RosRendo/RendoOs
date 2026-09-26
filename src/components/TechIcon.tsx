import React from 'react';

interface TechIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function TechIcon({ name, className = '', size = 16 }: TechIconProps) {
  const norm = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');

  switch (norm) {
    // -------------------------------------------------------------
    // FRONTEND & FRAMEWORKS
    // -------------------------------------------------------------
    case 'react':
    case 'reactjs':
    case 'reactnative':
      return (
        <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" className={className}>
          <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
          <g stroke="#61DAFB" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      );

    case 'nextjs':
    case 'next':
      return (
        <svg width={size} height={size} viewBox="0 0 180 180" fill="none" className={className}>
          <mask id="mask-next" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
            <circle cx="90" cy="90" r="90" fill="black" />
          </mask>
          <g mask="url(#mask-next)">
            <circle cx="90" cy="90" r="90" fill="currentColor" />
            <path
              d="M149.508 157.438L69.1478 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.137 149.508 157.438Z"
              fill="#090a0f"
            />
            <path d="M115 54H127V126H115V54Z" fill="#090a0f" />
          </g>
        </svg>
      );

    case 'typescript':
    case 'ts':
      return (
        <svg width={size} height={size} viewBox="0 0 128 128" className={className}>
          <rect width="128" height="128" fill="#3178C6" rx="16" />
          <path
            d="M59.3 54.4H36.9v10.9h10.9v44.2h11.5V65.3H70V54.4H59.3zm38.8 15.6c-2.3-2.1-5.6-3.7-9.8-4.8l-4.1-1.1c-2.7-.7-4.6-1.5-5.7-2.3-1.1-.8-1.7-1.9-1.7-3.2 0-1.4.6-2.5 1.8-3.4 1.2-.9 2.8-1.3 4.9-1.3 2 0 3.7.4 5.2 1.3 1.5.9 2.6 2.1 3.3 3.8l9.6-5.8c-1.8-3.2-4.4-5.7-7.8-7.5-3.4-1.8-7.4-2.7-12-2.7-4.5 0-8.5.8-11.9 2.5-3.4 1.7-6 4-7.8 7-1.8 3-2.7 6.4-2.7 10.3 0 4.1 1.1 7.4 3.3 10 2.2 2.6 5.3 4.6 9.3 5.8l4.4 1.3c3.2.9 5.5 1.9 6.8 2.9 1.3 1 2 2.3 2 3.8 0 1.6-.7 2.9-2.1 3.9-1.4 1-3.3 1.5-5.8 1.5-2.7 0-5-.6-6.9-1.8-1.9-1.2-3.3-2.9-4.2-5.1l-9.9 5.6c1.8 3.8 4.7 6.8 8.7 9 4 2.2 8.7 3.3 14.1 3.3 5 0 9.3-.9 13-2.7 3.7-1.8 6.5-4.3 8.4-7.5 1.9-3.2 2.9-6.9 2.9-11 0-4.3-1.1-7.8-3.4-10.4z"
            fill="#ffffff"
          />
        </svg>
      );

    case 'javascript':
    case 'js':
      return (
        <svg width={size} height={size} viewBox="0 0 128 128" className={className}>
          <rect width="128" height="128" fill="#F7DF1E" rx="16" />
          <path
            d="M74.8 87.7c2.5 4.3 5.9 7 11.2 7 5.7 0 9.3-2.9 9.3-8.8 0-6.1-4.2-8.3-11.3-11.4l-3.9-1.7c-11.1-4.7-18.5-10.6-18.5-23.2 0-11.5 8.9-20.2 22.8-20.2 9.9 0 17 3.5 21.9 12.2l-10 6.4c-2.2-3.9-4.7-5.5-8.5-5.5-4.1 0-7 2.6-7 6.1 0 4.3 2.7 6.2 9.2 9l3.9 1.7c13.1 5.6 20.9 11.2 20.9 24.5 0 14-11 21.6-25.7 21.6-14.3 0-23.3-6.9-27.4-15.6l13.1-7.6zM32.6 86.8c1.9 3.3 3.6 6 7.4 6 3.9 0 6.3-1.6 6.3-7.7V30h16v55.2c0 14.4-8.5 20.8-21.7 20.8-11.8 0-18.7-6.1-22.3-14.5l14.3-4.7z"
            fill="#000000"
          />
        </svg>
      );

    case 'tailwindcss':
    case 'tailwind':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
            fill="#38BDF8"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // BACKEND
    // -------------------------------------------------------------
    case 'nestjs':
    case 'nest':
      return (
        <svg width={size} height={size} viewBox="0 0 256 256" className={className}>
          <path
            d="M218.4 46.1c-1.2-1.4-2.8-2.3-4.5-2.8-17.5-4.8-44.4-4.8-77.9 14.6-21.6 12.5-35.3 32-42.6 44.5-2.4 4.1-4.2 7.7-5.5 10.4-3.7-3.9-9.1-8.2-16.1-11.4-16.9-7.8-36.9-6.3-51.1 3.8-12.7 9-19.5 24-17.7 39.1 1.9 15.3 12.4 28 27.2 33.1 3.2 1.1 6.5 1.7 9.8 1.7 13.8 0 27.1-9.2 32.7-22.7 1.5-3.7 2.4-7.5 2.6-11.4.3.4.6.8.9 1.2 17.5 24.3 36.6 29.8 55.4 24.1 11.4-3.5 21.6-11.4 29.9-23.3 1.2-1.7 2.3-3.5 3.3-5.3 1.7-3 3.1-6.2 4.4-9.5 6.1-16 12.7-33.4 28.5-45.7 17.1-13.3 34.6-15.3 47.3-13.3 2.7.4 5.3 1.2 7.8 2.2 1.4-13.4-3.5-24.9-10.7-33.5z"
            fill="#E0234E"
          />
        </svg>
      );

    case 'nodejs':
    case 'node':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z"
            stroke="#68A063"
            strokeWidth="2"
            fill="#68A063"
            fillOpacity="0.2"
          />
        </svg>
      );

    case 'golang':
    case 'go':
      return (
        <svg width={size} height={size} viewBox="0 0 256 100" fill="none" className={className}>
          <path
            d="M37.5 48.6c-1.3-4.8-4.4-8.8-9.1-11.2C22.6 34.5 15 35.8 10.6 40.5c-4.4 4.8-5.3 12.2-2.1 17.8 3.2 5.6 9.6 8.9 16 8.3 5.4-.5 10.4-3.8 12.6-8.8H23.9v-7.1h20.7c.3 2.1.4 4.2.4 6.3 0 7.4-2.6 14.5-7.4 20-5.8 6.5-14.3 10.3-23 10.3C6.5 87.1 0 79.4 0 68.3c0-10.7 6.4-20.2 16.3-23.7 9.8-3.4 21-.6 27.9 7l-6.7 4zM86.4 52.3c0 9.8-5.9 18.6-15 22.3-9.1 3.7-19.6 1.4-26.3-5.7-6.7-7.1-7.8-17.7-2.7-26 5.1-8.3 15-12.7 24.8-11 9.8 1.7 17.3 9.7 18.7 19.6.3.3.5.5.5.8zm-11.4 0c0-6.7-4.1-12.8-10.4-15.2-6.3-2.4-13.6-.5-17.8 4.8-4.2 5.3-4.5 12.7-.8 18.3 3.7 5.6 10.5 8.5 17.1 7.2 6.6-1.3 11.6-7.2 11.9-13.9v-1.2z"
            fill="#00ADD8"
          />
        </svg>
      );

    case 'python':
      return (
        <svg width={size} height={size} viewBox="0 0 128 128" className={className}>
          <path
            d="M63.4 5c-15.6 0-24.8 6.9-24.8 20.3v10.5h25.4v3.6H24.8C11.1 39.4 0 50.1 0 63.8c0 14.2 11.6 24.3 25.4 24.3h8.3v-11.6c0-13.7 11.9-24.9 25.8-24.9h25.2V25.3C84.7 11.4 75 5 63.4 5zm-10.6 8.3c3.6 0 6.6 2.9 6.6 6.6 0 3.6-2.9 6.6-6.6 6.6-3.6 0-6.6-2.9-6.6-6.6 0-3.7 2.9-6.6 6.6-6.6z"
            fill="#3776AB"
          />
          <path
            d="M64.6 123c15.6 0 24.8-6.9 24.8-20.3V92.2H64V88.6h39.2c13.7 0 24.8-10.7 24.8-24.4 0-14.2-11.6-24.3-25.4-24.3h-8.3v11.6c0 13.7-11.9 24.9-25.8 24.9H43.3v26.3c0 13.9 9.7 20.3 21.3 20.3zm10.6-8.3c-3.6 0-6.6-2.9-6.6-6.6 0-3.6 2.9-6.6 6.6-6.6 3.6 0 6.6 2.9 6.6 6.6 0 3.7-3 6.6-6.6 6.6z"
            fill="#FFD43B"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // DATABASES
    // -------------------------------------------------------------
    case 'postgresql':
    case 'postgres':
      return (
        <svg width={size} height={size} viewBox="0 0 128 128" className={className}>
          <path
            d="M64.4 17.5c-2.3 0-4.6.4-6.8 1-3.2.9-6.1 2.3-8.8 4.2-3.8 2.7-7 6.4-9.3 10.7-3.9 7.4-5.2 16.3-3.6 25.1 1.7 9 6.4 17.2 13.2 23.3 2.9 2.6 6.2 4.7 9.8 6.2 3.8 1.6 7.9 2.5 12 2.5 3.9 0 7.8-.8 11.4-2.3 3.6-1.5 6.9-3.7 9.6-6.4 6.3-6.2 10.4-14.5 11.7-23.4 1.2-8.5-.2-17.1-3.9-24.2-2.3-4.3-5.5-8-9.4-10.8-2.7-1.9-5.7-3.3-8.9-4.2-2.2-.6-4.6-1-7-1.7z"
            fill="#336791"
          />
          <path
            d="M63.7 32.8c-7.9 0-14.4 6.5-14.4 14.4 0 4.1 1.8 7.9 4.7 10.5 1.7 1.6 3.8 2.7 6.1 3.3.4.1.8.2 1.2.2h4.8c.4 0 .8-.1 1.2-.2 2.3-.6 4.4-1.7 6.1-3.3 2.9-2.6 4.7-6.4 4.7-10.5 0-7.9-6.5-14.4-14.4-14.4z"
            fill="#FFFFFF"
          />
        </svg>
      );

    case 'prisma':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M21.5 18.2L13.8 2.8c-.4-.8-1.5-.9-2.1-.3l-9.4 10c-.5.5-.5 1.4 0 1.9l6.5 7.4c.5.5 1.3.7 2 .3l10.3-3.2c.7-.2.9-1 .4-1.6l-.3.9z"
            stroke="#2D3748"
            strokeWidth="1.5"
            fill="#5A67D8"
          />
          <path d="M12.5 3.5L3.8 13.5l6.5 7 10-3.3L12.5 3.5z" fill="#0C344B" />
        </svg>
      );

    case 'sqlite':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M3 5c0-1.66 4.03-3 9-3s9 1.34 9 3v14c0 1.66-4.03 3-9 3s-9-1.34-9-3V5z"
            fill="#003B57"
          />
          <path
            d="M21 5c0 1.66-4.03 3-9 3S3 6.66 3 5"
            stroke="#00A9E0"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'mongodb':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M12 2C12 2 5 7.5 5 13.5C5 17.5 8 21.5 12 22C16 21.5 19 17.5 19 13.5C19 7.5 12 2 12 2Z"
            fill="#47A248"
          />
          <path d="M12 2v20c-1-1-3-3-3-6.5S12 2 12 2z" fill="#449845" />
        </svg>
      );

    case 'redis':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M2 7l10-4 10 4-10 4-10-4z" fill="#DC382D" />
          <path d="M2 12l10 4 10-4-10-4-10 4z" fill="#B7271F" />
          <path d="M2 17l10 4 10-4-10-4-10 4z" fill="#911813" />
        </svg>
      );

    // -------------------------------------------------------------
    // INFRASTRUCTURE & TOOLS
    // -------------------------------------------------------------
    case 'docker':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M2 14c1 4 5 7 10 7s9-3 10-7c-1-1-4-1-6 0-1-3-4-4-7-3-1-2-4-2-6 0-1.5 0-2 1-1 3z"
            fill="#2496ED"
          />
          <rect x="5" y="10" width="2" height="2" fill="#2496ED" rx="0.3" />
          <rect x="8" y="10" width="2" height="2" fill="#2496ED" rx="0.3" />
          <rect x="11" y="10" width="2" height="2" fill="#2496ED" rx="0.3" />
          <rect x="8" y="7" width="2" height="2" fill="#2496ED" rx="0.3" />
          <rect x="11" y="7" width="2" height="2" fill="#2496ED" rx="0.3" />
        </svg>
      );

    case 'aws':
    case 'awsec2':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M7 8l-4 4 4 4M17 8l4 4-4 4M10 6l4 12"
            stroke="#FF9900"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'cloudflare':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
            fill="#F38020"
          />
        </svg>
      );

    case 'nginx':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 2l9 5.2v10.4l-9 5.2-9-5.2V7.2L12 2z" fill="#009639" />
          <path
            d="M9 8v8l6-8v8"
            stroke="#FFFFFF"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // DESIGN & PLATFORMS (GITHUB, FIGMA)
    // -------------------------------------------------------------
    case 'github':
    case 'git':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            fill="currentColor"
          />
        </svg>
      );

    case 'figma':
      return (
        <svg width={size} height={size} viewBox="0 0 38 57" fill="none" className={className}>
          <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
          <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
          <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
          <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
          <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
        </svg>
      );

    case 'socketio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="10" fill="#010101" />
          <path d="M12 4l-4 8h4l-1 8 6-10h-5l2-6z" fill="#FFFFFF" />
        </svg>
      );

    case 'threejs':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13H5.5L12 6.5z" fill="currentColor" />
        </svg>
      );

    case 'monacoeditor':
    case 'vscode':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M17.5 2.5L7 11.5l10.5 9 4.5-2.5V5l-4.5-2.5zM7 11.5L2 8v8l5-4.5z"
            fill="#007ACC"
          />
        </svg>
      );

    // -------------------------------------------------------------
    // ADDITIONAL MODERN WEB & APP FRAMEWORKS
    // -------------------------------------------------------------
    case 'vite':
    case 'vitejs':
      return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
          <path
            d="M30.61 5.09L16.89 29.84a1 1 0 01-1.78 0L1.39 5.09a1 1 0 01.89-1.49h27.44a1 1 0 01.89 1.49z"
            fill="url(#vite-grad1)"
          />
          <path
            d="M22.77 3.6L16 16.4 12.3 8.8a.5.5 0 01.44-.72h9.59a.5.5 0 01.44.72z"
            fill="url(#vite-grad2)"
          />
          <path
            d="M17.84 2.87L11.08 16.2 7.74 8.7a.5.5 0 01.45-.7h9.2a.5.5 0 01.45.87z"
            fill="#FFD859"
          />
          <defs>
            <linearGradient id="vite-grad1" x1="1" y1="3" x2="31" y2="30" gradientUnits="userSpaceOnUse">
              <stop stopColor="#41D1FF" />
              <stop offset="1" stopColor="#BD34FE" />
            </linearGradient>
            <linearGradient id="vite-grad2" x1="12" y1="4" x2="23" y2="16" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFEA83" />
              <stop offset=".08" stopColor="#FFDD35" />
              <stop offset="1" stopColor="#FFA800" />
            </linearGradient>
          </defs>
        </svg>
      );

    case 'vue':
    case 'vuejs':
      return (
        <svg width={size} height={size} viewBox="0 0 256 221" className={className}>
          <path d="M204.8 0H256L128 220.8 0 0h97.92L128 51.2 157.44 0h47.36z" fill="#41B883" />
          <path d="M0 0l128 220.8L256 0h-51.2L128 132.48 49.92 0H0z" fill="#35495E" />
          <path d="M49.92 0L128 132.48 204.8 0h-47.36L128 51.2 97.92 0H49.92z" fill="#41B883" />
        </svg>
      );

    case 'svelte':
    case 'sveltekit':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M20.2 6.5C19.3 4.2 16.7 3 13.9 3.5c-1.8.3-3.3 1.4-4.2 3-.3.6-.5 1.3-.4 2-.8-.4-1.8-.5-2.7-.2-2.1.7-3.4 2.8-3.1 5 .2 1.5 1.1 2.8 2.5 3.4-.2.8-.2 1.6.1 2.3 1 2.3 3.6 3.5 6.4 3 1.8-.3 3.3-1.4 4.2-3 .3-.6.5-1.3.4-2 .8.4 1.8.5 2.7.2 2.1-.7 3.4-2.8 3.1-5-.2-1.5-1.1-2.8-2.5-3.4.2-.8.2-1.6-.1-2.3z"
            fill="#FF3E00"
          />
        </svg>
      );

    case 'supabase':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M13.4 2L2 14.5h8.6L9.6 22l11.4-12.5h-8.6L13.4 2z"
            fill="#3ECF8E"
          />
        </svg>
      );

    case 'vercel':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M12 2L24 22H0L12 2z" fill="currentColor" />
        </svg>
      );

    case 'firebase':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 17.5L6.5 2.5 10 9 4 17.5z" fill="#FFA000" />
          <path d="M14 6L10 9l-6 8.5 12 6.5 4-18-6 0z" fill="#F57C00" />
          <path d="M12 24l8-4.5L16 6 12 24z" fill="#FFCA28" />
        </svg>
      );

    case 'graphql':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="3" r="2" fill="#E10098" />
          <circle cx="21" cy="8" r="2" fill="#E10098" />
          <circle cx="21" cy="16" r="2" fill="#E10098" />
          <circle cx="12" cy="21" r="2" fill="#E10098" />
          <circle cx="3" cy="16" r="2" fill="#E10098" />
          <circle cx="3" cy="8" r="2" fill="#E10098" />
          <path d="M12 3l9 5v8l-9 5-9-5V8l9-5z" stroke="#E10098" strokeWidth="1.5" />
          <path d="M12 3v18M3 8l18 8M3 16l18-8" stroke="#E10098" strokeWidth="1.5" />
        </svg>
      );

    case 'electron':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="2" fill="#9FEAF9" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#9FEAF9" strokeWidth="1.2" transform="rotate(30 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#9FEAF9" strokeWidth="1.2" transform="rotate(90 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4" stroke="#9FEAF9" strokeWidth="1.2" transform="rotate(150 12 12)" />
        </svg>
      );

    case 'rust':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="9" stroke="#DEA584" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M9 7h4a3 3 0 010 6H9V7zm0 6h4l3 4" stroke="#DEA584" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'bun':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-3.5-2.2-6.5-5.3-7.5-.4-1.2-1.5-2-2.7-2-1.2 0-2.3.8-2.7 2C6.2 7.5 4 10.5 4 14z"
            fill="#FBF0DF"
            stroke="#1E1E1E"
            strokeWidth="1.5"
          />
          <circle cx="9.5" cy="13.5" r="1.2" fill="#1E1E1E" />
          <circle cx="14.5" cy="13.5" r="1.2" fill="#1E1E1E" />
          <path d="M11 16c.5.5 1.5.5 2 0" stroke="#E77878" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );

    case 'linear':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <path
            d="M3.2 12.8L12.8 3.2C13.2 2.8 13.9 2.8 14.3 3.2L20.8 9.7C21.2 10.1 21.2 10.8 20.8 11.2L11.2 20.8C10.8 21.2 10.1 21.2 9.7 20.8L3.2 14.3C2.8 13.9 2.8 13.2 3.2 12.8Z"
            fill="#5E6AD2"
          />
        </svg>
      );

    // Default fallback icon
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" opacity="0.6" />
          <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
  }
}

/**
 * TechBadge: renders real brand SVG icon + tech name badge
 */
export function TechBadge({
  name,
  className = '',
  size = 14,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700/60 shadow-sm ${className}`}
    >
      <TechIcon name={name} size={size} />
      <span>{name}</span>
    </span>
  );
}
