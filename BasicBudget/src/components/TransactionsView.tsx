import { ChangeEvent, useState } from "react";
import { useTransactions } from "./CsvContext";
import Papa from "papaparse";

const TransactionsView = () => {
  const { transactionData, setTransactionData } = useTransactions();

  const categories = ["Income", "Expense", "Transfer", "Other"];

  const [selectedTransaction, setSelectedTransaction] = useState<number>();

  //   tags prop
  const tags = ["Groceries", "Rent", "Utilities", "Other", "Fun"];

  // key words for tags to look for
  const keyWords: { [key: string]: string[] } = {
    Groceries: ["FRESHCHOICE", "WOOLWORTHS", "COUNTDOWN", "PAK'NSAVE"],
    Rent: ["Rent"],
    Utilities: ["ELECTRICITY", "WATER", "INTERNET", "PHONE"],
    Fun: ["LIQUOR", "THE OUTBACK HAMILTON", "BEER", "WINE", "SPIRITS"],
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          const data = result.data as string[][];
          const transactionData = data.slice(6); // Skip the first 6 lines

          // Remove Cheque Number column
          const transactionDataWithoutChequeNumber = transactionData.map(
            (row) => {
              return row.slice(0, 3).concat(row.slice(4));
            }
          );

          // Remove empty lines
          const nonEmptyData = transactionDataWithoutChequeNumber.filter(
            (row) => row.some((cell) => cell.trim() !== "")
          );

          // Add categories to transactionData
          const tempCategories = nonEmptyData.map((row) => {
            const payee = row[3];
            const memo = row[4];
            const amount = parseFloat(row[5]);
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

          // Add categories to new end column of transactionData
          const newTransactionDataWithCategories = nonEmptyData.map(
            (row, index) => {
              return [...row, tempCategories[index]];
            }
          );

          // Add tags to transactionData
          const tempTags = newTransactionDataWithCategories.map((row) => {
            // const memo = row[4];
            const payee = row[3];
            // check if payee contains key words
            for (const tag in keyWords) {
              if (keyWords[tag].some((word) => payee.includes(word))) {
                return tag;
              }
              return "Other";
            }
          });

          // Add tags to new end column of transactionData
          const newTransactionDataWithTags =
            newTransactionDataWithCategories.map((row, index) => {
              const tag = tempTags[index] || ""; // Set tag to an empty string if it's undefined
              return [...row, tag];
            });

          setTransactionData(newTransactionDataWithTags);
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

  //   Handle tag change
  const handleTagChange = (
    event: ChangeEvent<HTMLSelectElement>,
    rowIndex: number
  ) => {
    const newTransactionData = [...transactionData];
    newTransactionData[rowIndex][8] = event.target.value;
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
            <th>Payee</th>
            <th>Memo</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Tag</th>
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
                setSelectedTransaction(rowIndex);
              }}
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>
                  {/* if cellIndex = 7 and cell = "other" then highlight the text */}
                  {cellIndex === 7 && cell === "Other" ? (
                    <span className="text-error">{cell}</span>
                  ) : cellIndex === 7 && cell === "Other" ? (
                    <span className="text-success">{cell}</span>
                  ) : cellIndex === 7 && cell === "Groceries" ? (
                    <span className="text-success">{cell}</span>
                  ) : cellIndex === 7 && cell === "Rent" ? (
                    <span className="text-success">{cell}</span>
                  ) : cellIndex === 7 && cell === "Utilities" ? (
                    <span className="text-success">{cell}</span>
                  ) : cellIndex === 7 && cell === "Fun" ? (
                    <span className="text-success">{cell}</span>
                  ) : (
                    cell
                  )}
                  {/* {cell} */}
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
                  <th>Payee</th>
                  <th>Memo</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Tag</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {selectedTransaction !== undefined ? (
                    transactionData[selectedTransaction].map((cell, index) => (
                      <td key={index}>
                        {index === 6 ? (
                          <select
                            value={cell}
                            className="select select-bordered"
                            onChange={(event) =>
                              handleCategoryChange(event, selectedTransaction)
                            }
                          >
                            {categories.map((category, index) => (
                              <option key={index} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        ) : index === 7 ? (
                          <select
                            value={cell}
                            className="select select-bordered"
                            onChange={(event) =>
                              handleTagChange(event, selectedTransaction)
                            }
                          >
                            {tags.map((tag, index) => (
                              <option key={index} value={tag}>
                                {tag}
                              </option>
                            ))}
                          </select>
                        ) : (
                          cell
                        )}
                      </td>
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
