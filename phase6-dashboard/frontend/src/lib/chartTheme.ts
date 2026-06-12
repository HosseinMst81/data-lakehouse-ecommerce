export const getChartThemeColors = (isDark: boolean) => {
  return {
    grid: isDark ? '#334155' : '#e2e8f0',
    text: isDark ? '#94a3b8' : '#94a3b8',
    label: isDark ? '#cbd5e1' : '#64748b',
    tooltip: {
      bg: isDark ? '#1e293b' : '#1e293b',
      text: isDark ? '#f1f5f9' : '#f1f5f9',
      label: isDark ? '#cbd5e1' : '#cbd5e1',
    },
  }
}

export function useChartTheme() {
  const isDark =
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark')
  return getChartThemeColors(isDark)
}
