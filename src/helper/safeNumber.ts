export const safeNumber = (value: unknown | null | undefined): number => {
  const testValue = Number(value);
  return typeof testValue === 'number' && !isNaN(testValue) ? testValue : 0;
};
