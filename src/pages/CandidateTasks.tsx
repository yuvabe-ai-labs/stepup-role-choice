import Navbar from "@/components/Navbar";
import { useState } from "react";
import ApplicationStatusCard from "@/components/ApplicationStatusCard";
import { useApplicationsStatusCard } from "@/hooks/useApplicationStatusCard";
import { useAuth } from "@/hooks/useAuth";

export default function CandidateTasks() {
  const [selected, setSelected] = useState("Tasks Management");
  const { user } = useAuth();
  const { applications } = useApplicationsStatusCard(user.id);

  const menuItems = ["Tasks Management", "Application Status"];

  return (
    <div className="bg-[#F8F9FA]">
      <Navbar />
      <div className="flex h-screen mx-24 bg-white">
        {/* Left Sidebar */}
        <aside className="w-[20%] border-r-2 border-gray-300">
          <h2 className="text-2xl font-medium px-5 pt-5">Applications</h2>

          <div className="flex flex-col">
            {menuItems.map((item) => (
              <button
                key={item}
                onClick={() => setSelected(item)}
                className={`px-7 py-5 text-left border-b border-gray-200 font-medium  ${
                  item === selected ? "text-blue-500" : "text-gray-600"
                }
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        {/* Right Content */}
        <main className="w-[80%] px-20 py-10">
          <h1 className="text-xl font-medium text-gray-800 mb-7">{selected}</h1>

          <p className="text-gray-600">
            {selected === "Tasks Management" && ""}
            {selected === "Application Status" &&
              (applications
                ? applications.map((application, index) => (
                    <ApplicationStatusCard
                      key={index}
                      application={application}
                    />
                  ))
                : null)}
          </p>
        </main>
      </div>
    </div>
  );
}
