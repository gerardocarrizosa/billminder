export const formatDate = (
  date: Date | undefined,
  format?: {
    year?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
    day?: 'numeric' | '2-digit';
  }
): string => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('es-ES', {
    year: format?.year ?? 'numeric',
    month: format?.month ?? 'long',
    day: format?.day ?? 'numeric',
  });
};
