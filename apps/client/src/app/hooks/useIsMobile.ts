import { useMediaQuery } from '@mantine/hooks';

// 48em ≈ 768px, matching Mantine's `sm` breakpoint default — keeps the
// "is this mobile?" check in lockstep with Mantine responsive props
// (e.g. `cols={{ base: 1, sm: 2 }}`) elsewhere in the app.
const MOBILE_QUERY = '(max-width: 48em)';

export function useIsMobile(): boolean {
  return useMediaQuery(MOBILE_QUERY) ?? false;
}
