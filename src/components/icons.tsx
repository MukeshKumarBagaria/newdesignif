import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  xmlns: 'http://www.w3.org/2000/svg',
});

export const CaretRight = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CaretDown = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CaretUp = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CaretDoubleUp = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 14l6-6 6 6M6 20l6-6 6 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CaretDoubleDown = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 4l6 6 6-6M6 10l6 6 6-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowDown = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Filled chevron — Figma node 5938:50701 (IFMIS-NG_BPL). Next CTA 20×20, fill #255AC3 via currentColor. */
export const NextButtonArrow = ({ size = 20, ...p }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...p}
  >
    <path
      d="M16.2882 11.9133L10.6632 17.5383C10.5762 17.6257 10.4727 17.695 10.3587 17.7423C10.2447 17.7897 10.1226 17.814 9.99918 17.814C9.8758 17.814 9.75362 17.7897 9.63967 17.7423C9.52571 17.695 9.42222 17.6257 9.33512 17.5383L3.71012 11.9133C3.534 11.7372 3.43506 11.4983 3.43506 11.2492C3.43506 11.0001 3.534 10.7613 3.71012 10.5852C3.88624 10.409 4.12511 10.3101 4.37418 10.3101C4.62326 10.3101 4.86213 10.409 5.03825 10.5852L9.06247 14.6094V3.125C9.06247 2.87636 9.16124 2.6379 9.33705 2.46209C9.51287 2.28627 9.75133 2.1875 9.99997 2.1875C10.2486 2.1875 10.4871 2.28627 10.6629 2.46209C10.8387 2.6379 10.9375 2.87636 10.9375 3.125V14.6094L14.9617 10.5844C15.1378 10.4083 15.3767 10.3093 15.6257 10.3093C15.8748 10.3093 16.1137 10.4083 16.2898 10.5844C16.4659 10.7605 16.5649 10.9994 16.5649 11.2484C16.5649 11.4975 16.4659 11.7364 16.2898 11.9125L16.2882 11.9133Z"
      fill="currentColor"
    />
  </svg>
);

export const Search = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx={11} cy={11} r={6.5} stroke="currentColor" strokeWidth={1.8} />
    <path d="M20 20l-3.2-3.2" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
  </svg>
);

export const Calendar = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x={3.5} y={5} width={17} height={15} rx={2.5} stroke="currentColor" strokeWidth={1.6} />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Bell = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 9a6 6 0 1112 0v3.2c0 .8.3 1.5.8 2.1L20 16H4l1.2-1.7c.5-.6.8-1.3.8-2.1V9z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M10 19a2 2 0 004 0" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const Settings = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx={12} cy={12} r={3} stroke="currentColor" strokeWidth={1.6} />
    <path d="M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 01-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 01-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 012.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 012.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

export const ChevronDown = CaretDown;

/* Module tile icons */
export const IconBudget = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x={3} y={6} width={18} height={13} rx={2} stroke="currentColor" strokeWidth={1.6} />
    <path d="M3 10h18" stroke="currentColor" strokeWidth={1.6} />
    <path d="M7 15h3" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const IconDeposit = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3v10m0 0l-3.5-3.5M12 13l3.5-3.5" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const IconReceipt = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M9 8h6M9 12h6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const IconBMS = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x={2.5} y={7} width={19} height={10} rx={2} stroke="currentColor" strokeWidth={1.6} />
    <circle cx={12} cy={12} r={2.2} stroke="currentColor" strokeWidth={1.6} />
    <path d="M6 10.5v3M18 10.5v3" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const IconStrongRoom = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x={3.5} y={3.5} width={17} height={17} rx={2} stroke="currentColor" strokeWidth={1.6} />
    <path d="M3.5 9h17M3.5 14.5h17M9 3.5v17M14.5 3.5v17" stroke="currentColor" strokeWidth={1.4} />
  </svg>
);

export const IconPension = ({ size = 22, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 3c1.6 0 3 1.3 3 3v4h1.5a2 2 0 012 2v6.5a2 2 0 01-2 2h-9a2 2 0 01-2-2V12a2 2 0 012-2H9V6c0-1.7 1.4-3 3-3z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
  </svg>
);

export const IconHRMS = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx={12} cy={8} r={3.5} stroke="currentColor" strokeWidth={1.6} />
    <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const IconDashboard = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x={3} y={3} width={7.5} height={7.5} rx={1.5} stroke="currentColor" strokeWidth={1.6} />
    <rect x={13.5} y={3} width={7.5} height={4.5} rx={1.5} stroke="currentColor" strokeWidth={1.6} />
    <rect x={13.5} y={10.5} width={7.5} height={10.5} rx={1.5} stroke="currentColor" strokeWidth={1.6} />
    <rect x={3} y={13.5} width={7.5} height={7.5} rx={1.5} stroke="currentColor" strokeWidth={1.6} />
  </svg>
);

export const IconWallet = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x={3} y={6} width={18} height={13} rx={2} stroke="currentColor" strokeWidth={1.6} />
    <path d="M16 13h2" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
  </svg>
);

export const IconBriefcase = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <rect x={3} y={7} width={18} height={13} rx={2} stroke="currentColor" strokeWidth={1.6} />
    <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" strokeWidth={1.6} />
  </svg>
);

export const IconUser = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx={12} cy={8} r={3.5} stroke="currentColor" strokeWidth={1.6} />
    <path d="M5 20c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const IconLink = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M10 14a4 4 0 015.7 0l2.8-2.8a4 4 0 00-5.7-5.7L11.2 7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
    <path d="M14 10a4 4 0 01-5.7 0L5.6 12.8a4 4 0 005.7 5.7L12.8 17" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
  </svg>
);

export const IconPaperclip = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M21 11l-8.5 8.5a5 5 0 11-7-7l8-8a3.5 3.5 0 015 5l-8 8a2 2 0 01-3-3l7-7" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Phosphor PencilSimpleLine — exact 1:1 match of Figma asset 5830:83881
   (path geometry, stroke-width 2, round caps/joins). Stroke uses
   currentColor so callers can theme it via Tailwind text-* classes. */
export const IconPen = ({ size = 24, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <g clipPath="url(#icon-pen-clip)">
      <path
        d="M15 18L18.75 14.25L18 11.25"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.68969 20.2501H4.5C4.30109 20.2501 4.11032 20.1711 3.96967 20.0305C3.82902 19.8898 3.75 19.699 3.75 19.5001V15.3104C3.75009 15.1118 3.82899 14.9213 3.96938 14.7807L15.5306 3.2195C15.6713 3.07895 15.862 3 16.0608 3C16.2596 3 16.4503 3.07895 16.5909 3.2195L20.7806 7.40637C20.9212 7.54701 21.0001 7.7377 21.0001 7.93653C21.0001 8.13535 20.9212 8.32605 20.7806 8.46668L9.21937 20.0307C9.07883 20.1711 8.88834 20.25 8.68969 20.2501Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 6L18 11.25"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.79785 15.0479L8.95223 20.2022"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="icon-pen-clip">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

/* Phosphor-style FilePlus — used by Select File button (Figma node 5830:83954) */
export const IconFilePlus = ({ size = 20, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path
      d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9l-6-6z"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <path
      d="M14 3v6h6"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinejoin="round"
    />
    <path
      d="M12 12v6M9 15h6"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
    />
  </svg>
);

export const IconCheck = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12l4.5 4.5L19 7" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconCheckCircle = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.6} />
    <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconTrash = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 7h16M10 7V4h4v3M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconRefresh = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M4 12a8 8 0 0114.5-4.6M20 12a8 8 0 01-14.5 4.6M4 4v4h4M20 20v-4h-4" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconSave = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M5 4h11l3 3v13a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
    <path d="M7 4v5h9V4M8 14h8" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconAttachFile = ({ size = 16, ...p }: IconProps) => IconPaperclip({ size, ...p });

export const IconClock = ({ size = 16, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx={12} cy={12} r={8.5} stroke="currentColor" strokeWidth={1.6} />
    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPlus = ({ size = 14, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);

export const IconGlobe = ({ size = 18, ...p }: IconProps) => (
  <svg {...base(size)} {...p}>
    <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.6} />
    <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="currentColor" strokeWidth={1.4} />
  </svg>
);
