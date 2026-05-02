export default function TopNav({ tabs, activeTab, onTabChange }) {
  return (
    <header className="sys-header">
      <div className="sys-logo">
        Car<span>Geeks</span>
      </div>
      <nav className="screen-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={tab.key === activeTab ? "stab active" : "stab"}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.tabLabel || tab.label}
          </button>
        ))}
      </nav>
      <div className="sys-meta">
        <span className="sys-badge">v1.0 · 5 screens</span>
      </div>
    </header>
  );
}
