// src/theme/theme.js
export const COLORS = {
  background: '#0E0B1F',
  surface: '#1A1533',
  primary: '#6C5CE7',
  textLight: '#E0E0E0',
  textDark: '#0F0F0F',
  muted: '#AAAAAA',
  error: '#FF6B6B',
};

export const FONTS = {
  logo: {
    fontSize: 38,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: COLORS.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.muted,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textLight,
  },
};

export const SPACING = {
  padding: 16,
  margin: 16,
  radius: 10,
};
