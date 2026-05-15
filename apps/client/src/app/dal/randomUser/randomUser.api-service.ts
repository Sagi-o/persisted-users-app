import axios from 'axios';

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

const RANDOM_USER_URL = 'https://randomuser.me/api/';

// `inc` trims the response to only the fields the spec needs (~80% smaller payload)
const INCLUDED_FIELDS = 'gender,name,location,email,login,dob,phone,picture';

export const randomUserApiService = {
  getAll: async (count = 10): Promise<RandomUser[]> => {
    const { data } = await axios.get<RandomUserResponse>(RANDOM_USER_URL, {
      params: { results: count, inc: INCLUDED_FIELDS },
    });
    return data.results;
  },
};
