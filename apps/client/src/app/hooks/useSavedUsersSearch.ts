import { useDebouncedValue } from '@mantine/hooks';
import { parseAsString, useQueryState } from 'nuqs';

// Long enough that we don't hit the server on every keystroke,
// short enough to feel instant.
const SEARCH_DEBOUNCE_MS = 200;

// Filter lives in `?q=` so it survives navigating into a profile and back,
// and can be linked/bookmarked. `clearOnDefault` strips the empty value
// from the URL so a blank filter leaves a clean address bar.
export function useSavedUsersSearch() {
  const [filter, setFilter] = useQueryState(
    'q',
    parseAsString.withDefault('').withOptions({ clearOnDefault: true }),
  );
  const [debouncedQ] = useDebouncedValue(filter.trim(), SEARCH_DEBOUNCE_MS);

  return {
    filter,
    setFilter,
    debouncedQ,
    isSearching: debouncedQ.length > 0,
  };
}
