import type { RandomUser, SavedUser } from '@org/shared';

/**
 * Normalized row shape consumed by `UsersTable`. Lets the same component
 * render Random users (nested API shape) and Saved users (flat DB shape).
 */
export type UserRow = {
  id: string;
  fullName: string;
  gender: string;
  country: string;
  phone: string;
  email: string;
  thumbnail: string;
};

export function randomUserToRow(u: RandomUser): UserRow {
  return {
    id: u.login.uuid,
    fullName: `${u.name.title} ${u.name.first} ${u.name.last}`,
    gender: u.gender,
    country: u.location.country,
    phone: u.phone,
    email: u.email,
    thumbnail: u.picture.thumbnail,
  };
}

export function savedUserToRow(u: SavedUser): UserRow {
  return {
    id: u.id,
    fullName: `${u.title} ${u.firstName} ${u.lastName}`,
    gender: u.gender,
    country: u.country,
    phone: u.phone,
    email: u.email,
    thumbnail: u.pictureThumbnail,
  };
}
