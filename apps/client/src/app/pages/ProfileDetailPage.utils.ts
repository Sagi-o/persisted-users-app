import type { SavedUser } from '@org/shared';
import type { RandomUser } from '../dal/randomUser/randomUser.api-service';
import type { CreateUserPayload } from '../dal/user/user.api-service';

/**
 * Unified shape used by `ProfileDetailPage`. Fields mirror `CreateUserPayload`
 * so saving a random profile is a one-liner: merge the edited name in and POST.
 */
export type ProfileView = CreateUserPayload;

export function randomUserToProfile(u: RandomUser): ProfileView {
  return {
    id: u.login.uuid,
    title: u.name.title,
    firstName: u.name.first,
    lastName: u.name.last,
    gender: u.gender,
    email: u.email,
    phone: u.phone,
    pictureLarge: u.picture.large,
    pictureThumbnail: u.picture.thumbnail,
    country: u.location.country,
    state: u.location.state,
    city: u.location.city,
    streetNumber: u.location.street.number,
    streetName: u.location.street.name,
    dobDate: u.dob.date,
    age: u.dob.age,
  };
}

export function savedUserToProfile(u: SavedUser): ProfileView {
  const { createdAt: _createdAt, ...rest } = u;
  return rest;
}

export function getBirthYear(dobDate: string): number | null {
  const year = new Date(dobDate).getUTCFullYear();
  return Number.isNaN(year) ? null : year;
}
