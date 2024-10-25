// Utility Functions
export const formatToSlug = (input: string): string => {
  return input.toLowerCase().replace(/\s+/g, '-');
};
