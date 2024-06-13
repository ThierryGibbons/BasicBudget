import React, { useEffect, useState } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Line } from "react-chartjs-2";
import { useTransactions } from "../components/CsvContext";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// import { each } from "chart.js/helpers";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimelineTab: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [cashFlow, setCashFlow] = useState<number>(0);

  const { transactionData } = useTransactions();
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (transactionData.length > 0) {
      const labels = transactionData.map((row) => row[0]); // Assuming the date is in the first column
      const incomeData: number[] = [];
      const expenseData: number[] = [];
      const cashflowData: number[] = [];
      const days: string[] = [];
      let cumulativeCashflow = 0;

      // Get start and end date
      setStartDate(new Date(transactionData.map((row) => row[0])[1]));
      setEndDate(
        new Date(
          transactionData.map((row) => row[0])[transactionData.length - 2]
        )
      );

      // Get unique days
      transactionData.forEach((row) => {
        const day = row[0];
        if (!days.includes(day)) {
          days.push(day);
        }
      });

      // by day
      days.forEach((day) => {
        const dayData = transactionData.filter(
          (row) => row[0] === day && row[7] !== "Transfer"
        );
        const dayCashflow = dayData.reduce((acc, row) => {
          return acc + parseFloat(row[6]);
        }, 0);
        cumulativeCashflow += dayCashflow;
        cashflowData.push(cumulativeCashflow);

        const dayIncome = dayData.reduce((acc, row) => {
          return acc + (row[7] === "Income" ? parseFloat(row[6]) : 0);
        }, 0);
        incomeData.push(dayIncome);

        const dayExpenses = dayData.reduce((acc, row) => {
          return acc + (row[7] === "Expense" ? parseFloat(row[6]) : 0);
        }, 0);
        expenseData.push(dayExpenses);
      });

      // by transaction
      // transactionData.forEach((row) => {
      //   const category = row[7];
      //   const amount = parseFloat(row[6]);
      //   if (category === "Income") {
      //     incomeData.push(amount);
      //     expenseData.push(0);
      //   } else if (category === "Expense") {
      //     expenseData.push(amount);
      //     incomeData.push(0);
      //   } else {
      //     incomeData.push(0);
      //     expenseData.push(0);
      //   }

      //   if (category === "Income" || category === "Expense") {
      //     cumulativeCashflow += amount;
      //     cashflowData.push(cumulativeCashflow);
      //   }
      // });

      // totals
      setTotalIncome(
        incomeData.reduce((a, b) => a + b, 0).toFixed(2) as unknown as number
      );
      setTotalExpenses(
        expenseData.reduce((a, b) => a + b, 0).toFixed(2) as unknown as number
      );
      setCashFlow(cumulativeCashflow.toFixed(2) as unknown as number);

      setChartData({
        labels,
        datasets: [
          {
            label: "Cashflow",
            data: cashflowData,
            borderColor: "rgba(54, 162, 235, 1)",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
          },
          {
            label: "Income",
            data: incomeData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
          },
          {
            label: "Expenses",
            data: expenseData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      });
    }
  }, [transactionData]);

  return (
    <div>
      {/* Date select */}
      <div className="flex justify-end gap-5">
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <p>{startDate?.toLocaleDateString("en-GB")}</p>
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <p>{endDate?.toLocaleDateString("en-GB")}</p>
        </label>
      </div>

      <div className="flex h-96">
        {/* income/ expense quick view */}
        <div className="flex flex-col justify-start">
          <div className="stats shadow bg-base-200 m-1 mt-5">
            <div className="stat">
              <div className="stat-title">Cash Flow</div>
              <div
                className={`stat-value ${
                  cashFlow >= 0 ? "text-success" : "text-error"
                }`}
              >
                ${cashFlow}
              </div>
              <div className="stat-desc">Calculated from uploaded data</div>
            </div>
          </div>
          <div className="stats shadow bg-base-200 m-1 mt-5">
            <div className="stat">
              <div className="stat-title">Income</div>
              <div className="stat-value">${totalIncome}</div>
              <div className="stat-desc">Calculated from uploaded data</div>
            </div>
          </div>
          <div className="stats shadow bg-base-200 m-1 mt-5">
            <div className="stat">
              <div className="stat-title">Expenses</div>
              <div className="stat-value">${totalExpenses}</div>
              <div className="stat-desc">Calculated from uploaded data</div>
            </div>
          </div>
        </div>

        {/* Monthly cashflow graph */}
        <div className="flex justify-end w-full">
          <div className="stats shadow m-2 mt-5 bg-base-200 w-full">
            <Line data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineTab;
