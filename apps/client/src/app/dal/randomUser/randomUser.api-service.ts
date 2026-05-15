import axios from 'axios';
import type { RandomUser, RandomUserResponse } from '@org/shared';

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
