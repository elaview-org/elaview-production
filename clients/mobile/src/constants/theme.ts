export const colors = {
  // Brand
  primary: "#0088FF",
  primaryLight: "#E6F4FF",

  // Neutral
  black: "#000000",
  white: "#FFFFFF",

  // Grays
  gray50: "#F8F9FA",
  gray100: "#F1F3F5",
  gray200: "#E9ECEF",
  gray300: "#DEE2E6",
  gray400: "#CED4DA",
  gray500: "#ADB5BD",
  gray600: "#868E96",
  gray700: "#495057",
  gray800: "#343A40",
  gray900: "#212529",

  // Semantic
  error: "#DC3545",
  success: "#28A745",
  warning: "#FFC107",
};

export const lightTheme = {
  background: colors.white,
  backgroundSecondary: colors.gray50,
  text: colors.black,
  textSecondary: colors.gray600,
  textMuted: colors.gray500,
  border: colors.gray300,
  borderFocus: colors.primary,
  card: colors.white,
  primary: colors.primary,
  error: colors.error,
};

export const darkTheme = {
  background: "#1E1E1E",
  backgroundSecondary: "#2D2D2D",
  text: colors.white,
  textSecondary: colors.gray400,
  textMuted: colors.gray500,
  border: colors.gray700,
  borderFocus: colors.primary,
  card: "#2D2D2D",
  primary: colors.primary,
  error: "#FF6B6B",
};

export type Theme = typeof lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 28,
  xxxl: 36,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
