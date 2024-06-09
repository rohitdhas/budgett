/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { BG_COLORS, SHORTNED_LABELS } from "../constants/charts";
import { currancyFormatter } from "../utils/chart.utils";

Chart.register(ChartDataLabels);

type DataItem = {
  category: string;
  total: number;
};

type Props = {
  data: DataItem[];
  isLoading: boolean;
};

export default function MonthlyStats(props: Props) {
  const { data } = props;
  const totalAmount = data.reduce((sum, item) => sum + item.total, 0);

  const chartData = {
    labels: data.map((item) => item.category),
    datasets: [
      {
        data: data.map((item) => item.total),
        backgroundColor: data.map((item) => {
          return BG_COLORS[item.category].bgColor;
        }),
        hoverBackgroundColor: data.map((item) => {
          return BG_COLORS[item.category].hoverBgColor;
        }),
      },
    ],
  };

  const options = {
    plugins: {
      datalabels: {
        formatter: (value: any) => {
          const percentage = ((value / totalAmount) * 100).toFixed(2);
          return `${percentage}%`;
        },
        color: "#fff",
        labels: {
          title: {
            font: {
              weight: "bold",
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const percentage = ((value / totalAmount) * 100).toFixed(2);
            return `${currancyFormatter.format(value)} (${percentage}%)`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="bg-white rounded-md shadow-md py-4 px-6 md:h-full w-full md:w-[65%] overflow-auto">
      <h3 className="text-lg font-bold my-2">🗓️ This Month</h3>
      <>
        {props.isLoading ? (
          <p className="text-center text-lg text-slate-600">🔄 Loading...</p>
        ) : (
          <>
            {data.length === 0 ? (
              <p className="text-center text-slate-600 underline">
                🎈 No data available
              </p>
            ) : (
              <div className="flex justify-between items-center flex-col md:flex-row">
                <div className="w-[65%]">
                  <Doughnut data={chartData} options={options as any} />
                </div>
                <CustomLegends data={data} />
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
}

const CustomLegends = ({ data }: { data: DataItem[] }) => {
  return (
    <div className="ml-6">
      {data.map((item) => (
        <div key={item.category} className="flex items-center mt-4">
          <div
            className="w-8 h-8 rounded-md mr-4"
            style={{
              backgroundColor: BG_COLORS[item.category].bgColor,
            }}
          ></div>
          <div>
            <p className="text-xs text-slate-600">
              {SHORTNED_LABELS[item.category]}
            </p>
            <p className="font-bold text-slate-600">
              {currancyFormatter.format(item.total)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
