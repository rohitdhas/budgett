/* eslint-disable react-hooks/exhaustive-deps */
import { Select, Tag } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CATEGORY_ICONS, EXPENSE_CATEGORIES } from "../constants/categories";
import { currancyFormatter } from "../utils/chart.utils";

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

type Props = {
  data: ExpenseGroup[];
  isLoading: boolean;
  refetch: (filters: { category?: string; subCategory?: string }) => void;
};

export default function ExpenseList(props: Props) {
  const { data, isLoading, refetch: fetchExpenses } = props;

  return (
    <div className="bg-white rounded-md shadow-md py-4 px-6 md:mx-2 mt-2 md:mt-0 md:h-full w-full md:w-[35%] overflow-auto">
      <Header fetchExpenses={fetchExpenses} />
      <List data={data} isLoading={isLoading} />
    </div>
  );
}

type HeaderProps = {
  fetchExpenses: (filters: { category?: string; subCategory?: string }) => void;
};

const Header = (props: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");

  useEffect(() => {
    clearQueryParams();
  }, []);

  useEffect(() => {
    setSelectedCategory(params.get("category") || "all");
    setSelectedSubCategory(params.get("subCategory") || "all");
  }, [location.search]);

  useEffect(() => {
    props?.fetchExpenses({
      category: selectedCategory,
      subCategory: selectedSubCategory,
    });
  }, [selectedCategory, selectedSubCategory]);

  const updateCategory = (category: string) => {
    if (category === "all") {
      clearQueryParams();
      return;
    }

    const params = new URLSearchParams();
    params.append("category", category);
    params.delete("subCategory");

    navigate({
      search: params.toString(),
    });
  };

  const updateSubCategory = (subCategory: string) => {
    if (subCategory === "all") {
      const params = new URLSearchParams(location.search);
      params.delete("subCategory");

      navigate({
        search: params.toString(),
      });
      return;
    }

    const params = new URLSearchParams(location.search);
    params.set("subCategory", subCategory);

    navigate({
      search: params.toString(),
    });
  };

  const clearQueryParams = () => {
    navigate({
      search: "",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center my-2">
        <h3 className="text-lg font-bold">⚡️ Transactions</h3>
        <Select
          defaultValue="all"
          style={{ width: 160 }}
          size="small"
          onChange={(e) => updateCategory(e)}
          options={[
            { value: "all", label: "All" },
            ...EXPENSE_CATEGORIES.map((item) => ({
              value: item.category,
              label: item.category,
            })),
          ]}
        />
      </div>
      {selectedCategory !== "all" && (
        <div className="mt-2">
          <Tag
            className="cursor-pointer"
            color={selectedSubCategory === "all" ? "blue" : ""}
            onClick={() => updateSubCategory("all")}
          >
            All
          </Tag>
          {(
            EXPENSE_CATEGORIES.find(
              (item) => item.category === selectedCategory
            )?.subcategories.map((item) => ({
              value: item.name,
              label: item.name,
            })) || []
          ).map((item) => (
            <Tag
              key={item.label}
              className={"cursor-pointer mt-1"}
              color={selectedSubCategory === item.label ? "blue" : ""}
              onClick={() => updateSubCategory(item.label)}
            >
              {item.label}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
};

type ListProps = {
  data: ExpenseGroup[];
  isLoading: boolean;
};

const List = (props: ListProps) => {
  if (props.isLoading) {
    return (
      <p className="text-center text-lg text-slate-600 my-4">🔄 Loading...</p>
    );
  }

  if (props.data.length === 0) {
    return <div className="text-center my-4">❌ No transactions</div>;
  }

  return (
    <div className="mt-4">
      {props.data.map((group) => (
        <div key={group.groupLabel} className="mt-4">
          <p className="text-sm text-slate-600">{group.groupLabel}</p>
          {group.transactions.map((transaction) => (
            <div key={transaction._id} className="mt-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <p className="text-4xl mr-4">
                    {CATEGORY_ICONS[transaction.subCategory]}
                  </p>
                  <div>
                    <h1 className="font-bold">{transaction.spentOn}</h1>
                    <p className="text-xs text-slate-600">
                      {transaction.subCategory}
                    </p>
                  </div>
                </div>
                <div>
                  <h1 className="font-semibold text-slate-600">
                    {currancyFormatter.format(transaction.amount)}
                  </h1>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
