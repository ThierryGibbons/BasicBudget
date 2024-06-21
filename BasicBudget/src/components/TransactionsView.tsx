import { ChangeEvent, useEffect, useState } from "react";
import { useTransactions } from "./CsvContext";
import Papa from "papaparse";

const TransactionsView = () => {
  const { transactionData, setTransactionData } = useTransactions();
  const { keyWords, setKeyWords } = useTransactions();

  const categories = ["Income", "Expense", "Transfer", "Other"];

  const [selectedTransaction, setSelectedTransaction] = useState<number>();

  const [filterTag, setFilterTag] = useState<string>("");

  const [selectedTransactionId, setSelectedTransactionId] = useState<string>();

  //   tags prop
  const tags = [
    "Transfer",
    "Groceries",
    "Rent",
    "Utilities",
    "Other",
    "Fun",
    "Pay",
  ];

  // key words for tags to look for
  const defaultKeyWords: { [key: string]: string[] } = {
    Transfer: ["Transfer", "MB TRANSFER", "mySavings", "SAVETHECHANG E"],
    Groceries: ["FRESHCHOICE", "WOOLWORTHS", "COUNTDOWN", "PAK'NSAVE"],
    Rent: ["Rent"],
    Utilities: ["ELECTRICITY", "WATER", "INTERNET", "PHONE"],
    Fun: ["LIQUOR", "THE OUTBACK HAMILTON", "BEER", "WINE", "SPIRITS"],
    Pay: ["PAY", "SALARY", "WAGES"],
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    loadChanges();
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
              memo.includes("SAVETHECHANG E")
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
            // console.log(keyWords);
            const payee = row[3];
            const memo = row[4];
            // check if payee contains key words
            for (const tag in keyWords) {
              if (
                keyWords[tag].some(
                  (word) => payee.includes(word) || memo.includes(word)
                )
              ) {
                return tag;
              }
            }
            return "Other";
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
    transactionId: string
  ) => {
    const newTransactionData = transactionData.map((row) => {
      if (row[1] === transactionId) {
        row[6] = event.target.value;
      }
      return row;
    });
    setTransactionData(newTransactionData);
  };

  //   Handle tag change
  const handleTagChange = (
    event: ChangeEvent<HTMLSelectElement>,
    transactionId: string
  ) => {
    const newTransactionData = transactionData.map((row) => {
      if (row[1] === transactionId) {
        row[7] = event.target.value;
      }
      return row;
    });
    setTransactionData(newTransactionData);
  };

  const loadChanges = () => {
    setKeyWords(defaultKeyWords);
    // console.log(keyWords);
  };

  // Show text when page is loaded
  useEffect(() => {
    console.log("Page loaded");
    loadChanges();
    // Add your code here to display the text or perform any other actions
  }, []);

  return (
    <>
      <div className="flex flex-col w-[20%]">
        {/* Import CSV file */}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-input file-input-bordered w-full max-w-xs"
        />
        {/* Choose tag to filter by */}
        <select
          className="select select-bordered mt-5"
          onChange={(event) => setFilterTag(event.target.value)}
        >
          <option className="text-center" value="">
            No Filter
          </option>
          {tags.map((tag, index) => (
            <option key={index} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        {/* Clear checkboxes */}
        <button
          className="btn btn-sm btn-outline mt-5"
          onClick={() => {
            const checkboxes = document.querySelectorAll(
              'input[type="checkbox"]'
            );
            checkboxes.forEach((checkbox) => {
              // Explicitly type checkbox as HTMLInputElement
              (checkbox as HTMLInputElement).checked = false;
            });
          }}
        >
          Clear Checkboxes
        </button>
      </div>
      <div className="flex flex-col items-center p-4">
        {/* Set selected to tag */}
        {/* Display transaction data */}
        <table className="table w-full mt-4">
          <thead>
            <tr>
              <th>Select</th>
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
            {transactionData
              .filter((row) => {
                const tag = row[7];
                // Add your filter condition here
                return tag === filterTag || filterTag === "";
              })
              .map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={(event) => {
                    // Add your click event handler here
                    if ((event.target as HTMLElement).tagName !== "INPUT") {
                      (
                        document.getElementById(
                          "tempModal"
                        ) as HTMLDialogElement
                      )?.showModal();
                      setSelectedTransaction(rowIndex);
                      setSelectedTransactionId(row[1]);
                    }
                  }}
                >
                  <td>
                    <input type="checkbox" className="checkbox" />
                  </td>
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
                      ) : cellIndex === 7 && cell === "Pay" ? (
                        <span className="text-success">{cell}</span>
                      ) : cellIndex === 7 && cell === "Transfer" ? (
                        <span className="text-warning">{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
        {/* Transaction Edit */}
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
                    {selectedTransactionId !== undefined ? (
                      transactionData
                        .find((row) => row[1] === selectedTransactionId)
                        ?.map((cell, index) => (
                          <td key={index}>
                            {index === 6 ? (
                              <select
                                value={cell}
                                className="select select-bordered"
                                onChange={(event) =>
                                  handleCategoryChange(
                                    event,
                                    selectedTransactionId || ""
                                  )
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
                                  handleTagChange(
                                    event,
                                    selectedTransactionId || ""
                                  )
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
              {/* add current payee to keywords */}
              <button
                className="btn btn-sm btn-outline btn-primary m-1"
                onClick={() => {
                  if (selectedTransactionId !== undefined) {
                    const selectedTransaction = transactionData.find(
                      (row) => row[1] === selectedTransactionId
                    );
                    if (selectedTransaction) {
                      const payee = selectedTransaction[3];
                      const tag = selectedTransaction[7];
                      setKeyWords({
                        ...keyWords,
                        [tag]: [...keyWords[tag], payee],
                      });

                      // Set all transactions with the same payee to the same tag
                      const newTransactionData = transactionData.map((row) => {
                        if (row[3] === payee) {
                          row[7] = tag;
                        }
                        return row;
                      });
                      setTransactionData(newTransactionData);
                    }
                  }
                }}
              >
                Set tag to all transactions with this payee
              </button>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
};

export default TransactionsView;
