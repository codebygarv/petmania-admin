import React from "react";

export default function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-neutral-900/80 border border-neutral-800/80 rounded-xl backdrop-blur-md">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              isActive
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
