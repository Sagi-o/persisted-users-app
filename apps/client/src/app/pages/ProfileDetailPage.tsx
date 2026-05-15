import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Button,
  Center,
  Divider,
  Group,
  Loader,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';
import { modals } from '@mantine/modals';
import {
  IconAlertCircle,
  IconDeviceFloppy,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { BackButton } from '../components/BackButton';
import type { RandomUser } from '../dal/randomUser/randomUser.api-service';
import {
  RANDOM_USERS_KEY,
  useRandomUsers,
} from '../dal/randomUser/useRandomUsersAPI';
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUser,
} from '../dal/user/useUserAPI';
import {
  getBirthYear,
  randomUserToProfile,
  savedUserToProfile,
  type ProfileView,
} from './ProfileDetailPage.utils';

type Source = 'random' | 'saved';

// Force LTR rendering on inputs holding Latin data inside the RTL form.
const LTR_INPUT = {
  input: { direction: 'ltr' as const, textAlign: 'left' as const },
};

export function ProfileDetailPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { source, id } = useParams<{ source: Source; id: string }>();
  const isValidSource = source === 'random' || source === 'saved';

  const randomQuery = useRandomUsers();
  const userQuery = useUser(id);

  const randomUser = id
    ? randomQuery.data?.find((u) => u.login.uuid === id)
    : undefined;
  const savedUser = userQuery.data ?? undefined;
  const isSaved = !!savedUser;

  // Persisted record wins as the source of truth when both exist, so an
  // already-saved user opened from the random page shows the DB values.
  // Falls back to the random-list cache only when the user isn't in the DB.
  const profile: ProfileView | undefined = savedUser
    ? savedUserToProfile(savedUser)
    : source === 'random' && randomUser
      ? randomUserToProfile(randomUser)
      : undefined;

  const [title, setTitle] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const initializedFor = useRef<string | null>(null);

  // Seed the editable name from the loaded profile, but only once per id —
  // re-running on every profile-object reference would clobber user edits
  // when the query cache updates beneath us.
  useEffect(() => {
    if (profile && initializedFor.current !== profile.id) {
      setTitle(profile.title);
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      initializedFor.current = profile.id;
    }
  }, [profile]);

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  if (!isValidSource) {
    return (
      <Stack>
        <BackButton />
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Unknown profile source.
        </Alert>
      </Stack>
    );
  }

  // `userQuery` decides Save vs Delete + Update target, so we always wait for it.
  // `randomQuery` only matters when we need it as a fallback data source.
  const isLoading =
    userQuery.isLoading || (source === 'random' && randomQuery.isLoading);
  const error =
    userQuery.error ?? (source === 'random' ? randomQuery.error : null);

  if (isLoading) {
    return (
      <Center py="xl">
        <Loader />
      </Center>
    );
  }
  if (error) {
    return (
      <Stack>
        <BackButton />
        <Alert color="red" icon={<IconAlertCircle size={16} />}>
          Failed to load profile.
        </Alert>
      </Stack>
    );
  }
  if (!profile) {
    return (
      <Stack>
        <BackButton />
        <Alert color="yellow" icon={<IconAlertCircle size={16} />}>
          Profile not found.
        </Alert>
      </Stack>
    );
  }

  const fullName = `${title} ${firstName} ${lastName}`.trim();
  const birthYear = getBirthYear(profile.dobDate);
  const canSave = !isSaved;
  const canDelete = isSaved;
  // Guard with `initializedFor` so the brief window between profile load and
  // the seeding `useEffect` doesn't read as "dirty" (empty state vs profile).
  const isDirty =
    initializedFor.current === profile.id &&
    (title !== profile.title ||
      firstName !== profile.firstName ||
      lastName !== profile.lastName);

  const handleSave = () => {
    createMutation.mutate(
      { ...profile, title, firstName, lastName },
      {
        onSuccess: () => {
          notifications.show({ color: 'green', message: 'Profile saved' });
          navigate('/saved');
        },
        onError: () =>
          notifications.show({
            color: 'red',
            message: 'Failed to save profile',
          }),
      },
    );
  };

  const handleUpdate = () => {
    if (isSaved) {
      updateMutation.mutate(
        { id: profile.id, payload: { title, firstName, lastName } },
        {
          onSuccess: () =>
            notifications.show({ color: 'green', message: 'Profile updated' }),
          onError: () =>
            notifications.show({
              color: 'red',
              message: 'Failed to update profile',
            }),
        },
      );
      return;
    }
    queryClient.setQueryData<RandomUser[]>([RANDOM_USERS_KEY], (prev) =>
      prev?.map((u) =>
        u.login.uuid === profile.id
          ? { ...u, name: { title, first: firstName, last: lastName } }
          : u,
      ),
    );
    notifications.show({ color: 'green', message: 'Name updated locally' });
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Delete profile',
      children: <Text size="sm">Remove {fullName} from saved profiles?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteMutation.mutate(profile.id, {
          onSuccess: () => {
            notifications.show({ color: 'green', message: 'Profile deleted' });
            navigate('/saved');
          },
          onError: () =>
            notifications.show({
              color: 'red',
              message: 'Failed to delete profile',
            }),
        });
      },
    });
  };

  return (
    <Stack>
      <BackButton />

      <div dir="rtl">
        <Stack>
          <Group align="center" wrap="nowrap">
            <Avatar src={profile.pictureLarge} size={160} radius="50%" />
            <Stack gap={4} style={{ minWidth: 0 }}>
              <Title order={2} dir="ltr" style={{ textAlign: 'left' }}>
                {fullName}
              </Title>
              <Text c="dimmed" tt="capitalize">
                {profile.gender}
              </Text>
            </Stack>
          </Group>

          <Divider />

          <Title order={4}>שם</Title>
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <TextInput
              label="תואר"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              styles={LTR_INPUT}
            />
            <TextInput
              label="שם פרטי"
              value={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
              styles={LTR_INPUT}
            />
            <TextInput
              label="שם משפחה"
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
              styles={LTR_INPUT}
            />
          </SimpleGrid>

          <Divider />

          <Title order={4}>פרטים</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <ReadOnlyField label="מגדר" value={profile.gender} capitalize />
            <ReadOnlyField
              label="גיל / שנת לידה"
              value={
                birthYear
                  ? `${profile.age} (${birthYear})`
                  : String(profile.age)
              }
            />
          </SimpleGrid>

          <Divider />

          <Title order={4}>כתובת</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <ReadOnlyField
              label="רחוב"
              value={`${profile.streetNumber} ${profile.streetName}`}
            />
            <ReadOnlyField label="עיר" value={profile.city} />
            <ReadOnlyField label="מחוז" value={profile.state} />
            <ReadOnlyField label="מדינה" value={profile.country} />
          </SimpleGrid>

          <Divider />

          <Title order={4}>פרטי קשר</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            <ReadOnlyField label="אימייל" value={profile.email} />
            <ReadOnlyField label="טלפון" value={profile.phone} />
          </SimpleGrid>

          <Divider />

          <Group justify="flex-start">
            {canSave && (
              <Button
                leftSection={<IconDeviceFloppy size={16} />}
                onClick={handleSave}
                loading={createMutation.isPending}
              >
                שמור
              </Button>
            )}
            <Tooltip label="אין שינויים לעדכן" disabled={isDirty}>
              <span style={{ display: 'inline-block' }}>
                <Button
                  variant="default"
                  leftSection={<IconEdit size={16} />}
                  onClick={handleUpdate}
                  loading={updateMutation.isPending}
                  disabled={!isDirty}
                >
                  עדכן
                </Button>
              </span>
            </Tooltip>
            {canDelete && (
              <Button
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={handleDelete}
                loading={deleteMutation.isPending}
              >
                מחק
              </Button>
            )}
          </Group>
        </Stack>
      </div>
    </Stack>
  );
}

function ReadOnlyField({
  label,
  value,
  capitalize,
}: {
  label: string;
  value: string;
  capitalize?: boolean;
}) {
  return (
    <Stack gap={2}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text
        dir="ltr"
        style={{ textAlign: 'left' }}
        tt={capitalize ? 'capitalize' : undefined}
      >
        {value}
      </Text>
    </Stack>
  );
}
