import { ChangeEvent, useState } from "react";
import { useTransactions } from "./CsvContext";
import Papa from "papaparse";

const TransactionsView = () => {
  const { transactionData, setTransactionData } = useTransactions();

  const categories = ["Income", "Expense", "Transfer", "Other"];

  const [selectedTransaction, setSelectedTransaction] = useState<string[]>();

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
            <tr
              key={rowIndex}
              onClick={() => {
                (
                  document.getElementById("tempModal") as HTMLDialogElement
                )?.showModal();
                setSelectedTransaction(row);
              }}
            >
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
      <dialog id="tempModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Edit Transaction</h3>
          <div className="py-4">
            {/* Transaction Info */}
            <table className="table">
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
                <tr>
                  {selectedTransaction !== undefined ? (
                    selectedTransaction.map((cell, index) => (
                      <td key={index}>{cell}</td>
                    ))
                  ) : (
                    <td colSpan={8}>No transaction selected</td>
                  )}
                </tr>
              </tbody>
            </table>
            {/* {selectedTransaction?.map((cell, index) => (
                  <span key={index}>
                    <strong>{transactionData[0][index]}: </strong>
                    {cell}
                    <br />
                  </span>
                ))} */}
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default TransactionsView;
