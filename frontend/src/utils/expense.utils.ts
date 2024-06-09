interface Expense {
  _id: string;
  spentOn: string;
  amount: number;
  category: string;
  subCategory: string;
  userId: string;
  createdAt: string;
}

export const groupExpensesByDate = (transactions: Expense[]) => {
  const groups: { groupLabel: string; transactions: Expense[] }[] = [];
  const groupedTransactions: { [key: string]: Expense[] } = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.createdAt);
    const groupLabel = getGroupLabel(date);

    if (!groupedTransactions[groupLabel]) {
      groupedTransactions[groupLabel] = [];
    }

    groupedTransactions[groupLabel].push(transaction);
  });

  for (const [groupLabel, transactions] of Object.entries(
    groupedTransactions
  )) {
    groups.push({ groupLabel, transactions });
  }

  return groups;
};

const getGroupLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isToday(date)) {
    return "Today";
  } else if (isYesterday(date)) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-US", { dateStyle: "medium" });
  }
};

const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (date: Date): boolean => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};
