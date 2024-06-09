/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

let token: string | undefined;

const responseBody = (res: any) => res.data;

const getHeader = () => {
  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const api = {
  get: (url: string) => axios.get(url, getHeader()).then(responseBody),
  post: (url: string, body: any) =>
    axios.post(url, body, getHeader()).then(responseBody),
  put: (url: string, body: any) =>
    axios.put(url, body, getHeader()).then(responseBody),
  delete: (url: string) => axios.delete(url, getHeader()).then(responseBody),
};

const Expenses = {
  getExpenses: (filters: {
    category?: string;
    subCategory?: string;
    userId: string;
  }) => {
    const query = new URLSearchParams(filters).toString();
    return api.get(`/expenses?${query}`);
  },
  createExpense: (data: {
    spentOn: string;
    amount: number;
    category: string;
    subCategory: string;
    userId: string;
  }) => api.post("/expenses", data),

  getMonthlyStats: (userId: string) =>
    api.get(`/stats/monthly?userId=${userId}`),
};

export { Expenses };
