import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Expenses } from "../api-agent";
import { groupExpensesByDate } from "../utils/expense.utils";

interface Expense {
  _id: string;
  spentOn: string;
  amount: number;
  category: string;
  subCategory: string;
  userId: string;
  createdAt: string;
}

interface ExpenseGroup {
  groupLabel: string;
  transactions: Expense[];
}

export const useFetchExpenses = () => {
  const user = useUser();
  const [data, setData] = useState<ExpenseGroup[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async (
    filters: { category?: string; subCategory?: string } = {}
  ) => {
    try {
      setIsLoading(true);
      const response = await Expenses.getExpenses({
        userId: user.user?.id as string,
        ...filters,
      });
      setData(groupExpensesByDate(response.data));
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return { data, isLoading, refetch: fetchExpenses };
};

export const useFetchMonthlyStats = () => {
  const user = useUser();
  const [data, setData] = useState<{ category: string; total: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchMonthlyStats();
  }, []);

  const fetchMonthlyStats = async () => {
    try {
      setIsLoading(true);
      const response = await Expenses.getMonthlyStats(user.user?.id as string);
      setData(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return { data, isLoading, refetch: fetchMonthlyStats };
};
