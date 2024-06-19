import { useTransactions } from "../components/CsvContext";

const SettingsTab = () => {
  const { keyWords, setKeyWords } = useTransactions();
  return (
    <div>
      <h1 className="text-xl font-bold">Settings</h1>
      <p>Seperate each word by ,</p>

      {/* cards for each tag */}
      <div className="grid grid-cols-2 gap-4">
        {/* map each key word */}
        {Object.keys(keyWords).map((key) => (
          <div key={key} className="stats shadow bg-base-200 m-1 mt-5 w-11/12">
            <div className="stat">
              <div className="stat-value pb-5">{key}</div>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Memo filter"
                value={keyWords[key]}
                onChange={(e) => {
                  setKeyWords({ ...keyWords, [key]: [e.target.value] });
                }}
              ></textarea>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsTab;
