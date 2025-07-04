import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { listTransactionsAPI } from "../../services/transactions/transactionService";

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionChart = () => {
  const {
    data: transactions,
    isError,
    isLoading,
    isFetched,
    error,
    refetch,
  } = useQuery({
    queryFn: () => listTransactionsAPI({}), // Pass empty object to get all transactions
    queryKey: ["list-transactions-chart"],
  });

  //! Show loading state
  if (isLoading) {
    return (
      <div className="my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="text-center">Loading chart...</div>
      </div>
    );
  }

  //! Show error state
  if (isError) {
    return (
      <div className="my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
        <div className="text-center text-red-500">Error loading chart data</div>
      </div>
    );
  }

  //! Check if transactions exist
  if (!transactions || transactions.length === 0) {
    return (
      <div className="my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
        <h1 className="text-2xl font-bold text-center mb-6">
          Transaction Overview
        </h1>
        <div className="text-center text-gray-500">No transactions found</div>
      </div>
    );
  }

  //! calculate total income and expense
  const totals = transactions.reduce(
    (acc, transaction) => {
      if (transaction?.type === "income") {
        acc.income += transaction?.amount || 0;
      } else if (transaction?.type === "expense") {
        acc.expense += transaction?.amount || 0;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
  //! Data structure for the chart
  const data = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        label: "Transactions",
        data: [totals?.income || 0, totals?.expense || 0],
        backgroundColor: ["#10B981", "#EF4444"], // Green for income, Red for expense
        borderColor: ["#10B981", "#EF4444"],
        borderWidth: 1, // Fixed typo: was "borderWith"
        hoverOffset: 4,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 25,
          boxWidth: 12,
          font: {
            size: 14,
          },
          generateLabels: function(chart) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const meta = chart.getDatasetMeta(0);
                const style = meta.controller.getStyle(i);
                const value = data.datasets[0].data[i] || 0;
                return {
                  text: `${label}: $${value.toFixed(2)}`,
                  fillStyle: style.backgroundColor,
                  strokeStyle: style.borderColor,
                  lineWidth: style.borderWidth,
                  hidden: isNaN(data.datasets[0].data[i]) || meta.data[i].hidden,
                  index: i
                };
              });
            }
            return [];
          }
        },
      },
      title: {
        display: true,
        text: "Income vs Expense",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 30,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    cutout: "70%",
  };
  return (
    <div className="my-8 p-6 bg-white rounded-lg shadow-xl border border-gray-200">
      <h1 className="text-2xl font-bold text-center mb-6">
        Transaction Overview
      </h1>
      
      {/* Display totals */}
      <div className="flex justify-around mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600">Total Income</div>
          <div className="text-xl font-bold text-green-600">
            ${totals?.income?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Total Expense</div>
          <div className="text-xl font-bold text-red-600">
            ${totals?.expense?.toFixed(2) || '0.00'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-600">Net Balance</div>
          <div className={`text-xl font-bold ${(totals?.income - totals?.expense) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ${((totals?.income || 0) - (totals?.expense || 0)).toFixed(2)}
          </div>
        </div>
      </div>

      <div style={{ height: "350px" }}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default TransactionChart;
