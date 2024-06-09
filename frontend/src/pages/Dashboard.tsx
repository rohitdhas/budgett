import { PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import AddExpenseForm from "../components/AddExpenseForm";
import ExpenseList from "../components/ExpenseList";
import MonthlyStats from "../components/MonthlyStats";
import Navbar from "../components/Navbar";
import { useFetchExpenses, useFetchMonthlyStats } from "../hooks/expense.hooks";

export default function Dashboard() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const {
    data: expenseListData,
    isLoading: isLoadingExpenseList,
    refetch: refetchExpenseList,
  } = useFetchExpenses();
  const {
    data: monthlyStatsData,
    refetch: refetchMonthlyStats,
    isLoading: isLoadingMonthlyStats,
  } = useFetchMonthlyStats();
  const [isAddExpenseFormOpen, setIsAddExpenseFormOpen] = useState(false);

  const refetch = () => {
    refetchExpenseList({
      category: queryParams.get("category") || "all",
      subCategory: queryParams.get("subCategory") || "all",
    });
    refetchMonthlyStats();
  };

  return (
    <div className="md:w-[80%] mx-auto h-full p-4">
      <Navbar />
      <div className="flex justify-between flex-col md:flex-row h-[90%]">
        <MonthlyStats
          data={monthlyStatsData}
          isLoading={isLoadingMonthlyStats}
        />
        <ExpenseList
          data={expenseListData}
          isLoading={isLoadingExpenseList}
          refetch={refetchExpenseList}
        />
      </div>
      {/* Form */}
      <AddExpenseForm
        isOpen={isAddExpenseFormOpen}
        onClose={() => setIsAddExpenseFormOpen(false)}
        refetchExpenses={refetch}
      />
      {/* Floating button */}
      <Tooltip title="Add Expense" placement="top">
        <div
          onClick={() => setIsAddExpenseFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer py-3 px-4 rounded-full w-min text-white font-bold fixed bottom-10 right-10 md:right-40"
        >
          <PlusOutlined />
        </div>
      </Tooltip>
    </div>
  );
}
