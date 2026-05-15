import { useMediaQuery } from '@mantine/hooks';

// 48em ≈ 768px, matching Mantine's `sm` breakpoint default — keeps the
// "is this mobile?" check in lockstep with Mantine responsive props
// (e.g. `cols={{ base: 1, sm: 2 }}`) elsewhere in the app.
const MOBILE_QUERY = '(max-width: 48em)';

export function useIsMobile(): boolean {
  // `getInitialValueInEffect: false` evaluates the query in the useState
  // initializer instead of a post-mount effect, so the first paint already
  // reflects the real viewport — avoids a flash of the desktop layout on
  // mobile while the effect resolves.
  return (
    useMediaQuery(MOBILE_QUERY, false, { getInitialValueInEffect: false }) ??
    false
  );
}
