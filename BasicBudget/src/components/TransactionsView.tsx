import { ChangeEvent } from "react";
import { useTransactions } from "./CsvContext";
import Papa from "papaparse";

const TransactionsView = () => {
  const { transactionData, setTransactionData } = useTransactions();

  const categories = ["Income", "Expense", "Transfer", "Other"];

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data as string[][];
          const transactionData = data.slice(6); // Skip the first 6 lines

          // Remove empty lines
          const nonEmptyData = transactionData.filter((row) =>
            row.some((cell) => cell.trim() !== "")
          );

          // Add categories to transactionData
          const tempCategories = nonEmptyData.map((row) => {
            const payee = row[4];
            const memo = row[5];
            const amount = parseFloat(row[6]);
            if (isNaN(amount)) {
              return "Other";
            } else if (
              payee === "MB TRANSFER" ||
              payee === "mySavings" ||
              memo.includes("SAVETHECHANG E") ||
              memo.includes("12-3268- 0093432-50")
            ) {
              return "Transfer";
            }
            return amount > 0 ? "Income" : "Expense";
          });
          console.log("categories", tempCategories);

          // Add categories to new end column of transactionData
          const newTransactionData = nonEmptyData.map((row, index) => {
            return [...row, tempCategories[index]];
          });

          setTransactionData(newTransactionData);

          console.log("newTransactionData", newTransactionData);
        },
      });
    }
  };

  // Handle category change
  const handleCategoryChange = (
    event: ChangeEvent<HTMLSelectElement>,
    rowIndex: number
  ) => {
    const newTransactionData = [...transactionData];
    newTransactionData[rowIndex][7] = event.target.value;
    setTransactionData(newTransactionData);
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Import CSV file */}
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="file-input file-input-bordered w-full max-w-xs"
      />

      {/* Display transaction data */}
      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Unique Id</th>
            <th>Tran Type</th>
            <th>Cheque Number</th>
            <th>Payee</th>
            <th>Memo</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactionData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {cellIndex === 7 ? (
                    <select
                      value={cell}
                      className="select select-bordered"
                      onChange={(event) =>
                        handleCategoryChange(event, rowIndex)
                      }
                    >
                      {categories.map((category, index) => (
                        <option key={index} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  ) : (
                    cell
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsView;
