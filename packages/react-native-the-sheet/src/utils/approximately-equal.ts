export const isApproxEqual = (
  v1: number,
  v2: number,
  epsilon: number = 0.1,
): boolean => {
  'worklet'
  return Math.abs(v1 - v2) < epsilon
}
