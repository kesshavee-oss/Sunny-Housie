import { ThemeId } from '../types/housie';

export interface BallStyle {
  bg: string;
  text: string;
  dotBg: string;
}

export interface ThemePalette {
  id: ThemeId;
  name: string;
  swatchColors: [string, string];
  pageBg: string;
  headerBg: string;
  cardBorder: string;
  subtleCellBg: string;
  subtleCellBorder: string;
  hostCardGradient: string;
  hostCardShadow: string;
  hostCardSubtext: string;
  playCardGradient: string;
  playCardShadow: string;
  playCardSubtext: string;
  homeBtn: string;
  lockBtn: string;
  callerBallBg: string;
  callerBallText: string;
  callerEmptyText: string;
  callNextBtn: string;
  boardLatestRing: string;
  setupIconBg: string;
  setupSelectedCount: string;
  setupGenerateBtn: string;
  ticketNumberCellBorder: string;
  ticketAccents: Array<{
    headerBg: string;
    headerText: string;
    dotBg: string;
    ringColor: string;
    stripeGradient: string;
  }>;
  ballPalette: BallStyle[];
  confettiColors: string[];
  focusOutline: string;
  buntingColors: string[];
}

const CLASSIC_BALL_PALETTE: BallStyle[] = [
  {
    bg: 'bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 shadow-sm shadow-orange-500/30',
    text: 'text-white',
    dotBg: 'bg-orange-500',
  },
  {
    bg: 'bg-gradient-to-br from-yellow-300 via-amber-400 to-amber-500 shadow-sm shadow-amber-500/30',
    text: 'text-stone-950',
    dotBg: 'bg-amber-400',
  },
  {
    bg: 'bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 shadow-sm shadow-teal-500/30',
    text: 'text-white',
    dotBg: 'bg-teal-500',
  },
  {
    bg: 'bg-gradient-to-br from-pink-400 via-pink-500 to-rose-500 shadow-sm shadow-pink-500/30',
    text: 'text-white',
    dotBg: 'bg-pink-500',
  },
  {
    bg: 'bg-gradient-to-br from-purple-400 via-purple-500 to-violet-600 shadow-sm shadow-purple-500/30',
    text: 'text-white',
    dotBg: 'bg-purple-500',
  },
];

const DIWALI_BALL_PALETTE: BallStyle[] = [
  {
    bg: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-sm shadow-amber-500/35',
    text: 'text-stone-950',
    dotBg: 'bg-amber-400',
  },
  {
    bg: 'bg-gradient-to-br from-orange-400 via-amber-600 to-orange-700 shadow-sm shadow-orange-600/30',
    text: 'text-white',
    dotBg: 'bg-orange-600',
  },
  {
    bg: 'bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 shadow-sm shadow-rose-600/30',
    text: 'text-white',
    dotBg: 'bg-rose-600',
  },
  {
    bg: 'bg-gradient-to-br from-purple-500 via-violet-600 to-purple-700 shadow-sm shadow-purple-600/30',
    text: 'text-white',
    dotBg: 'bg-purple-600',
  },
  {
    bg: 'bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-600 shadow-sm shadow-amber-500/30',
    text: 'text-stone-950',
    dotBg: 'bg-amber-500',
  },
];

const CHRISTMAS_BALL_PALETTE: BallStyle[] = [
  {
    bg: 'bg-gradient-to-br from-red-500 via-red-600 to-rose-700 shadow-sm shadow-red-600/30',
    text: 'text-white',
    dotBg: 'bg-red-600',
  },
  {
    bg: 'bg-gradient-to-br from-emerald-500 via-green-600 to-green-700 shadow-sm shadow-green-600/30',
    text: 'text-white',
    dotBg: 'bg-green-600',
  },
  {
    bg: 'bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 shadow-sm shadow-amber-500/30',
    text: 'text-stone-950',
    dotBg: 'bg-amber-400',
  },
  {
    bg: 'bg-gradient-to-br from-rose-400 via-red-500 to-red-600 shadow-sm shadow-red-500/30',
    text: 'text-white',
    dotBg: 'bg-red-500',
  },
  {
    bg: 'bg-gradient-to-br from-teal-500 via-emerald-600 to-green-700 shadow-sm shadow-emerald-600/30',
    text: 'text-white',
    dotBg: 'bg-emerald-600',
  },
];

const PONGAL_BALL_PALETTE: BallStyle[] = [
  {
    bg: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 shadow-sm shadow-yellow-500/35',
    text: 'text-stone-950',
    dotBg: 'bg-yellow-400',
  },
  {
    bg: 'bg-gradient-to-br from-green-500 via-emerald-600 to-green-700 shadow-sm shadow-green-600/30',
    text: 'text-white',
    dotBg: 'bg-green-600',
  },
  {
    bg: 'bg-gradient-to-br from-orange-400 via-orange-500 to-amber-600 shadow-sm shadow-orange-500/30',
    text: 'text-white',
    dotBg: 'bg-orange-500',
  },
  {
    bg: 'bg-gradient-to-br from-lime-400 via-green-500 to-emerald-600 shadow-sm shadow-green-500/30',
    text: 'text-stone-950',
    dotBg: 'bg-green-500',
  },
  {
    bg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 shadow-sm shadow-amber-500/30',
    text: 'text-stone-950',
    dotBg: 'bg-amber-500',
  },
];

const SUMMER_BALL_PALETTE: BallStyle[] = [
  {
    bg: 'bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 shadow-sm shadow-sky-500/30',
    text: 'text-white',
    dotBg: 'bg-sky-500',
  },
  {
    bg: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-400 shadow-sm shadow-yellow-400/35',
    text: 'text-stone-950',
    dotBg: 'bg-yellow-400',
  },
  {
    bg: 'bg-gradient-to-br from-rose-400 via-coral-500 to-orange-500 shadow-sm shadow-rose-500/30',
    text: 'text-white',
    dotBg: 'bg-rose-500',
  },
  {
    bg: 'bg-gradient-to-br from-cyan-400 via-teal-500 to-teal-600 shadow-sm shadow-teal-500/30',
    text: 'text-white',
    dotBg: 'bg-teal-500',
  },
  {
    bg: 'bg-gradient-to-br from-orange-400 via-rose-400 to-pink-500 shadow-sm shadow-orange-400/30',
    text: 'text-white',
    dotBg: 'bg-orange-400',
  },
];

export const THEMES: Record<ThemeId, ThemePalette> = {
  classic: {
    id: 'classic',
    name: 'Classic',
    swatchColors: ['#F97316', '#14B8A6'],
    pageBg: 'bg-gradient-to-b from-[#FFFDF7] via-[#FFF4E6] to-[#FFE2CC]',
    headerBg: 'bg-[#FFF9F0]/90 border-orange-200/70',
    cardBorder: 'border-orange-200/70',
    subtleCellBg: 'bg-[#FFF9EC]',
    subtleCellBorder: 'border-amber-200/60',
    hostCardGradient: 'from-orange-500 via-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-500',
    hostCardShadow: 'shadow-lg shadow-orange-500/20',
    hostCardSubtext: 'text-orange-50',
    playCardGradient: 'from-teal-500 via-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-500',
    playCardShadow: 'shadow-lg shadow-teal-500/20',
    playCardSubtext: 'text-teal-50',
    homeBtn: 'bg-white hover:bg-orange-50 border-orange-200/80 text-stone-800',
    lockBtn: 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-900',
    callerBallBg: 'bg-gradient-to-br from-amber-300 via-orange-500 to-rose-500',
    callerBallText: 'text-white drop-shadow-xs',
    callerEmptyText: 'text-white/80',
    callNextBtn: 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25',
    boardLatestRing: 'ring-3 ring-stone-900/80 ring-offset-2 scale-105',
    setupIconBg: 'bg-teal-100 text-teal-700',
    setupSelectedCount: 'bg-teal-500 text-white shadow-md shadow-teal-500/25 scale-[1.03]',
    setupGenerateBtn: 'from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 shadow-lg shadow-teal-600/20',
    ticketNumberCellBorder: 'border-orange-200/90 hover:border-teal-400',
    ticketAccents: [
      {
        headerBg: 'bg-orange-50/70',
        headerText: 'text-orange-950',
        dotBg: 'bg-gradient-to-br from-pink-400 to-rose-500',
        ringColor: 'ring-pink-300',
        stripeGradient: 'from-orange-500 via-amber-400 to-teal-400',
      },
      {
        headerBg: 'bg-teal-50/70',
        headerText: 'text-teal-950',
        dotBg: 'bg-gradient-to-br from-teal-400 to-teal-600',
        ringColor: 'ring-teal-300',
        stripeGradient: 'from-teal-500 via-amber-400 to-pink-500',
      },
      {
        headerBg: 'bg-pink-50/70',
        headerText: 'text-pink-950',
        dotBg: 'bg-gradient-to-br from-orange-400 to-orange-600',
        ringColor: 'ring-orange-300',
        stripeGradient: 'from-pink-500 via-purple-500 to-amber-400',
      },
      {
        headerBg: 'bg-purple-50/70',
        headerText: 'text-purple-950',
        dotBg: 'bg-gradient-to-br from-purple-400 to-violet-600',
        ringColor: 'ring-purple-300',
        stripeGradient: 'from-purple-500 via-pink-500 to-teal-400',
      },
    ],
    ballPalette: CLASSIC_BALL_PALETTE,
    confettiColors: ['#F97316', '#FACC15', '#14B8A6', '#EC4899', '#8B5CF6'],
    focusOutline: 'focus-visible:outline-orange-600',
    buntingColors: ['#F97316', '#FACC15', '#14B8A6', '#EC4899', '#8B5CF6'],
  },

  diwali: {
    id: 'diwali',
    name: 'Diwali',
    swatchColors: ['#D97706', '#FACC15'],
    pageBg: 'bg-gradient-to-b from-[#FFF9E6] via-[#FDE6B8] to-[#FCD08B]',
    headerBg: 'bg-[#FFF5D6]/92 border-amber-300/80',
    cardBorder: 'border-amber-300/85',
    subtleCellBg: 'bg-[#FFFBEB]',
    subtleCellBorder: 'border-amber-200/80',
    hostCardGradient: 'from-amber-600 via-orange-600 to-amber-500 hover:from-amber-700 hover:to-orange-600',
    hostCardShadow: 'shadow-lg shadow-amber-700/25',
    hostCardSubtext: 'text-amber-50',
    playCardGradient: 'from-rose-600 via-amber-600 to-yellow-600 hover:from-rose-700 hover:to-amber-600',
    playCardShadow: 'shadow-lg shadow-rose-700/20',
    playCardSubtext: 'text-amber-50',
    homeBtn: 'bg-white hover:bg-amber-50 border-amber-300/90 text-stone-900',
    lockBtn: 'bg-amber-100 hover:bg-amber-200/80 border-amber-300 text-amber-950',
    callerBallBg: 'bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600',
    callerBallText: 'text-stone-950 drop-shadow-xs',
    callerEmptyText: 'text-stone-900/70',
    callNextBtn: 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-500 hover:from-amber-700 hover:to-orange-600 shadow-lg shadow-amber-700/25',
    boardLatestRing: 'ring-3 ring-stone-950 ring-offset-2 scale-105',
    setupIconBg: 'bg-amber-100 text-amber-800',
    setupSelectedCount: 'bg-amber-600 text-white shadow-md shadow-amber-600/30 scale-[1.03]',
    setupGenerateBtn: 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-lg shadow-amber-700/25',
    ticketNumberCellBorder: 'border-amber-300 hover:border-orange-500',
    ticketAccents: [
      {
        headerBg: 'bg-amber-100/75',
        headerText: 'text-amber-950',
        dotBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        ringColor: 'ring-amber-300',
        stripeGradient: 'from-amber-500 via-yellow-400 to-orange-600',
      },
      {
        headerBg: 'bg-orange-100/75',
        headerText: 'text-orange-950',
        dotBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
        ringColor: 'ring-rose-300',
        stripeGradient: 'from-orange-500 via-amber-400 to-rose-500',
      },
      {
        headerBg: 'bg-yellow-100/75',
        headerText: 'text-amber-950',
        dotBg: 'bg-gradient-to-br from-purple-500 to-violet-700',
        ringColor: 'ring-purple-300',
        stripeGradient: 'from-yellow-400 via-amber-500 to-purple-600',
      },
      {
        headerBg: 'bg-rose-100/70',
        headerText: 'text-rose-950',
        dotBg: 'bg-gradient-to-br from-amber-600 to-red-600',
        ringColor: 'ring-amber-300',
        stripeGradient: 'from-rose-500 via-amber-400 to-orange-500',
      },
    ],
    ballPalette: DIWALI_BALL_PALETTE,
    confettiColors: ['#F59E0B', '#FACC15', '#EA580C', '#E11D48', '#9333EA'],
    focusOutline: 'focus-visible:outline-amber-700',
    buntingColors: ['#F59E0B', '#FACC15', '#EA580C', '#E11D48', '#D97706'],
  },

  christmas: {
    id: 'christmas',
    name: 'Christmas',
    swatchColors: ['#DC2626', '#15803D'],
    pageBg: 'bg-gradient-to-b from-[#FFFFFF] via-[#F8FAFC] to-[#FEE2E2]',
    headerBg: 'bg-white/92 border-red-200/80',
    cardBorder: 'border-emerald-200/90',
    subtleCellBg: 'bg-[#F8FAF9]',
    subtleCellBorder: 'border-emerald-200/70',
    hostCardGradient: 'from-red-600 via-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700',
    hostCardShadow: 'shadow-lg shadow-red-600/20',
    hostCardSubtext: 'text-red-50',
    playCardGradient: 'from-green-700 via-emerald-600 to-green-600 hover:from-green-800 hover:to-emerald-700',
    playCardShadow: 'shadow-lg shadow-green-700/20',
    playCardSubtext: 'text-emerald-50',
    homeBtn: 'bg-white hover:bg-red-50 border-red-200 text-stone-900',
    lockBtn: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-950',
    callerBallBg: 'bg-gradient-to-br from-red-500 via-red-600 to-rose-700',
    callerBallText: 'text-white drop-shadow-xs',
    callerEmptyText: 'text-white/80',
    callNextBtn: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-600/25',
    boardLatestRing: 'ring-3 ring-stone-950 ring-offset-2 scale-105',
    setupIconBg: 'bg-emerald-100 text-emerald-800',
    setupSelectedCount: 'bg-green-700 text-white shadow-md shadow-green-700/25 scale-[1.03]',
    setupGenerateBtn: 'from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 shadow-lg shadow-green-700/20',
    ticketNumberCellBorder: 'border-emerald-200 hover:border-red-500',
    ticketAccents: [
      {
        headerBg: 'bg-red-50/85',
        headerText: 'text-red-950',
        dotBg: 'bg-gradient-to-br from-red-500 to-rose-600',
        ringColor: 'ring-red-300',
        stripeGradient: 'from-red-600 via-white to-green-600',
      },
      {
        headerBg: 'bg-emerald-50/85',
        headerText: 'text-emerald-950',
        dotBg: 'bg-gradient-to-br from-green-600 to-emerald-700',
        ringColor: 'ring-emerald-300',
        stripeGradient: 'from-green-600 via-amber-300 to-red-600',
      },
      {
        headerBg: 'bg-amber-50/80',
        headerText: 'text-amber-950',
        dotBg: 'bg-gradient-to-br from-red-600 to-red-700',
        ringColor: 'ring-red-300',
        stripeGradient: 'from-red-500 via-emerald-500 to-amber-400',
      },
      {
        headerBg: 'bg-green-50/80',
        headerText: 'text-green-950',
        dotBg: 'bg-gradient-to-br from-emerald-500 to-green-700',
        ringColor: 'ring-green-300',
        stripeGradient: 'from-emerald-600 via-red-500 to-white',
      },
    ],
    ballPalette: CHRISTMAS_BALL_PALETTE,
    confettiColors: ['#DC2626', '#15803D', '#FACC15', '#FFFFFF', '#E11D48'],
    focusOutline: 'focus-visible:outline-red-700',
    buntingColors: ['#DC2626', '#FFFFFF', '#15803D', '#FACC15', '#DC2626'],
  },

  pongal: {
    id: 'pongal',
    name: 'Pongal',
    swatchColors: ['#EAB308', '#15803D'],
    pageBg: 'bg-gradient-to-b from-[#FEFCE8] via-[#FEF3C7] to-[#DCFCE7]',
    headerBg: 'bg-[#FEFCE8]/92 border-yellow-300/80',
    cardBorder: 'border-yellow-300/90',
    subtleCellBg: 'bg-[#FEFDE8]',
    subtleCellBorder: 'border-lime-300/60',
    hostCardGradient: 'from-yellow-500 via-amber-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
    hostCardShadow: 'shadow-lg shadow-amber-500/20',
    hostCardSubtext: 'text-amber-50',
    playCardGradient: 'from-green-600 via-emerald-600 to-lime-600 hover:from-green-700 hover:to-lime-700',
    playCardShadow: 'shadow-lg shadow-green-600/20',
    playCardSubtext: 'text-green-50',
    homeBtn: 'bg-white hover:bg-yellow-50 border-yellow-300 text-stone-900',
    lockBtn: 'bg-green-50 hover:bg-green-100 border-green-300 text-green-950',
    callerBallBg: 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500',
    callerBallText: 'text-stone-950 drop-shadow-xs',
    callerEmptyText: 'text-stone-900/70',
    callNextBtn: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/25',
    boardLatestRing: 'ring-3 ring-stone-950 ring-offset-2 scale-105',
    setupIconBg: 'bg-yellow-100 text-amber-800',
    setupSelectedCount: 'bg-green-600 text-white shadow-md shadow-green-600/25 scale-[1.03]',
    setupGenerateBtn: 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-600/20',
    ticketNumberCellBorder: 'border-yellow-300 hover:border-green-500',
    ticketAccents: [
      {
        headerBg: 'bg-yellow-50/85',
        headerText: 'text-amber-950',
        dotBg: 'bg-gradient-to-br from-green-500 to-emerald-700',
        ringColor: 'ring-green-300',
        stripeGradient: 'from-yellow-400 via-green-500 to-orange-500',
      },
      {
        headerBg: 'bg-green-50/85',
        headerText: 'text-green-950',
        dotBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
        ringColor: 'ring-amber-300',
        stripeGradient: 'from-green-600 via-yellow-400 to-lime-500',
      },
      {
        headerBg: 'bg-amber-50/80',
        headerText: 'text-amber-950',
        dotBg: 'bg-gradient-to-br from-orange-500 to-red-500',
        ringColor: 'ring-orange-300',
        stripeGradient: 'from-orange-500 via-yellow-400 to-green-600',
      },
      {
        headerBg: 'bg-lime-50/80',
        headerText: 'text-lime-950',
        dotBg: 'bg-gradient-to-br from-emerald-500 to-green-700',
        ringColor: 'ring-lime-300',
        stripeGradient: 'from-lime-500 via-amber-400 to-green-600',
      },
    ],
    ballPalette: PONGAL_BALL_PALETTE,
    confettiColors: ['#EAB308', '#15803D', '#F97316', '#84CC16', '#FACC15'],
    focusOutline: 'focus-visible:outline-green-700',
    buntingColors: ['#EAB308', '#15803D', '#F97316', '#84CC16', '#FACC15'],
  },

  summer: {
    id: 'summer',
    name: 'Summer Fun',
    swatchColors: ['#0EA5E9', '#FB7185'],
    pageBg: 'bg-gradient-to-b from-[#E0F2FE] via-[#FEF9C3] to-[#FFE4E6]',
    headerBg: 'bg-[#F0F9FF]/92 border-sky-200/85',
    cardBorder: 'border-sky-200/90',
    subtleCellBg: 'bg-[#F0F9FF]',
    subtleCellBorder: 'border-sky-200/70',
    hostCardGradient: 'from-sky-500 via-cyan-500 to-blue-500 hover:from-sky-600 hover:to-blue-600',
    hostCardShadow: 'shadow-lg shadow-sky-500/20',
    hostCardSubtext: 'text-sky-50',
    playCardGradient: 'from-rose-400 via-orange-400 to-amber-400 hover:from-rose-500 hover:to-amber-500',
    playCardShadow: 'shadow-lg shadow-rose-400/25',
    playCardSubtext: 'text-white',
    homeBtn: 'bg-white hover:bg-sky-50 border-sky-200 text-slate-900',
    lockBtn: 'bg-sky-100 hover:bg-sky-200/75 border-sky-300 text-sky-950',
    callerBallBg: 'bg-gradient-to-br from-sky-400 via-cyan-500 to-teal-500',
    callerBallText: 'text-white drop-shadow-xs',
    callerEmptyText: 'text-white/85',
    callNextBtn: 'bg-gradient-to-r from-sky-500 via-cyan-500 to-rose-400 hover:from-sky-600 hover:to-rose-500 shadow-lg shadow-sky-500/25',
    boardLatestRing: 'ring-3 ring-slate-950 ring-offset-2 scale-105',
    setupIconBg: 'bg-sky-100 text-sky-700',
    setupSelectedCount: 'bg-sky-500 text-white shadow-md shadow-sky-500/25 scale-[1.03]',
    setupGenerateBtn: 'from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 shadow-lg shadow-sky-500/20',
    ticketNumberCellBorder: 'border-sky-200 hover:border-rose-400',
    ticketAccents: [
      {
        headerBg: 'bg-sky-50/85',
        headerText: 'text-sky-950',
        dotBg: 'bg-gradient-to-br from-sky-400 to-blue-600',
        ringColor: 'ring-sky-300',
        stripeGradient: 'from-sky-400 via-yellow-300 to-rose-400',
      },
      {
        headerBg: 'bg-rose-50/85',
        headerText: 'text-rose-950',
        dotBg: 'bg-gradient-to-br from-rose-400 to-orange-500',
        ringColor: 'ring-rose-300',
        stripeGradient: 'from-rose-400 via-amber-300 to-sky-400',
      },
      {
        headerBg: 'bg-yellow-50/85',
        headerText: 'text-amber-950',
        dotBg: 'bg-gradient-to-br from-teal-400 to-cyan-600',
        ringColor: 'ring-cyan-300',
        stripeGradient: 'from-yellow-400 via-rose-400 to-sky-500',
      },
      {
        headerBg: 'bg-cyan-50/85',
        headerText: 'text-cyan-950',
        dotBg: 'bg-gradient-to-br from-orange-400 to-rose-500',
        ringColor: 'ring-orange-300',
        stripeGradient: 'from-cyan-400 via-yellow-300 to-orange-400',
      },
    ],
    ballPalette: SUMMER_BALL_PALETTE,
    confettiColors: ['#0EA5E9', '#FACC15', '#FB7185', '#14B8A6', '#FB923C'],
    focusOutline: 'focus-visible:outline-sky-600',
    buntingColors: ['#0EA5E9', '#FACC15', '#FB7185', '#38BDF8', '#FB923C'],
  },
};

export const THEME_LIST: ThemePalette[] = [
  THEMES.classic,
  THEMES.diwali,
  THEMES.christmas,
  THEMES.pongal,
  THEMES.summer,
];
