/**
 * Subset of randomuser.me's response we actually consume.
 * https://randomuser.me/documentation
 */
export interface RandomUser {
  gender: string;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
  };
  email: string;
  login: {
    uuid: string;
  };
  dob: {
    date: string;
    age: number;
  };
  phone: string;
  picture: {
    large: string;
    thumbnail: string;
  };
}

export interface RandomUserResponse {
  results: RandomUser[];
}
