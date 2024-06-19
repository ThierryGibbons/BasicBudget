import { useTransactions } from "../components/CsvContext";

const SettingsTab = () => {
  const { keyWords, setKeyWords } = useTransactions();
  return (
    <div>
      {/* cards for each tag */}
      <div className="grid grid-cols-2 gap-4">
        {/* map each key word */}
        {Object.keys(keyWords).map((key) => (
          <div key={key} className="stats shadow bg-base-200 m-1 mt-5 w-11/12">
            <div className="stat">
              <div className="stat-value pb-5">{key}</div>
              {/* display each word as a button */}
              <div className="flex flex-row flex-wrap justify-center">
                {keyWords[key].map((word, index) => (
                  <button
                    key={index}
                    className="btn btn-sm btn-outline btn-ghost m-1 hover:btn-error"
                    onClick={() => {
                      setKeyWords({
                        ...keyWords,
                        [key]: keyWords[key].filter((_, i) => i !== index),
                      });
                    }}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {/* add button to type new word */}
              <input
                className="input input-bordered mt-5"
                placeholder="Add word"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setKeyWords({
                      ...keyWords,
                      [key]: [...keyWords[key], e.currentTarget.value],
                    });
                    e.currentTarget.value = "";
                  }
                }}
              />{" "}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsTab;
