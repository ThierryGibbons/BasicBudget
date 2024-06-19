import "./App.css";

// Tabs
import TimelineTab from "./tabs/TimelineTab";
import BudgetTab from "./tabs/BudgetTab";
import TransactionsTab from "./tabs/TransactionsTab";
import SettingsTab from "./tabs/SettingsTab";

// Components
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-lifted">
        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Timeline"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <TimelineTab />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Budget"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <BudgetTab />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Transactions"
          defaultChecked
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <TransactionsTab />
        </div>

        <input
          type="radio"
          name="my_tabs_2"
          role="tab"
          className="tab"
          aria-label="Settings"
        />
        <div
          role="tabpanel"
          className="tab-content bg-base-100 border-base-300 rounded-box p-6"
        >
          <SettingsTab />
        </div>
      </div>
    </div>
  );
}

export default App;
