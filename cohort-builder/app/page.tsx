"use client";

import React from "react";
import { CohortProvider } from "./contexts/CohortContext";
import EventBuilder from "./components/EventBuilder";
import EventList from "./components/EventList";
import IndexDateSelector from "./components/IndexDateSelector";
import CriteriaSelector from "./components/CriteriaSelector";

export default function Home() {
  return (
    <CohortProvider>
      <main className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">
            OMOP Cohort Builder
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="grid grid-cols-1 gap-1">
              <EventList />
              <IndexDateSelector />
            </div>
            <div className="grid grid-cols-1 h-min">
              <EventBuilder />
            </div>
          </div>
        </div>
      </main>
    </CohortProvider>
  );
}
