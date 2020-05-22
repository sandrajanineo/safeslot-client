import axios from 'axios';
import { API_URL, SERVICE_URL } from '../../common/consts';

export default class OwnerHomeService {
  fetchUser = async userId => {
    const res = await axios.get(
      `${API_URL}/users/${userId}?filter={"include": "stores"}`
    );
    console.log(res.data);
    return res;
  };

  fetchBookings = async storeId => {
    const filter = {
      where: { store_id: storeId },
      include: ['stores', 'stores_slots', 'users']
    };
    const res = await axios.get(
      `${API_URL}/bookings?filter=${JSON.stringify(filter)}`
    );
    return res;
  };

  fetchTokens = async storeId => {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    const filter = {
      where: {
        and: [
          { store_id: storeId },
          {
            date: {
              gte: date
            }
          }
        ]
      },
      order: 'current_token ASC'
    };

    const response = await axios.get(
      `${API_URL}/tokens?filter=${JSON.stringify(filter)}`
    );
    return response.data[0] || {};
  };

  updateToken = async (tokenId, tokenData) => {
    const response = await axios.put(`${API_URL}/tokens/${tokenId}`, {
      ...tokenData
    });
    return response;
  };

  generateSMSurl = (number, token, cs) => {
    const c = cs ? `currently%20serving%20${cs}` : '';
    const body = `Your%20token%20is%20${token}.%20${c}`;
    const str = `sms://${number};?&body=${body}`;
    return str;
  };

  generateToken = async (mobile, storeId) => {
    console.log(mobile);
    if (!mobile) {
      alert('Please enter mobile number');
      return;
    }
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const filter = {
      where: {
        and: [{ store_id: storeId }, { date: { gte: date } }]
      },
      order: 'token_number DESC'
    };
    try {
      const { data } = await axios.get(
        `${API_URL}/tokens?filter=${JSON.stringify(filter)}`
      );
      const token = data[0];
      const assignNumber = token ? token.next_assign_token : 1;

      const body = {
        store_id: storeId,
        mobile,
        token_number: assignNumber + 1,
        date
      };

      const bookingResponse = await axios.post(
        `${API_URL}/tokenBookings`,
        body
      );
      if (token) {
        const tokensResponse = await axios.patch(
          `${API_URL}/tokens/${token.id}`,
          { next_assign_token: assignNumber + 1 }
        );
      } else {
        const body = {
          date,
          next_assign_token: 1,
          current_token: 1,
          store_id: storeId
        };
        const tokensResponse = await axios.post(`${API_URL}/tokens`, body);
      }
      if (bookingResponse.status === 200) {
        // make sure this is the right code
        return assignNumber;
      }
    } catch (err) {
      console.error(err);
      return err;
    }
  };
}