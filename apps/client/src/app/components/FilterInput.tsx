import { CloseButton, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface FilterInputProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}

export function FilterInput({
  value,
  onChange,
  placeholder = 'Filter',
}: FilterInputProps) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
      leftSection={<IconSearch size={16} />}
      rightSection={
        value ? (
          <CloseButton
            size="sm"
            aria-label="Clear filter"
            onClick={() => onChange('')}
          />
        ) : null
      }
    />
  );
}
