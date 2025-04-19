"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import AddJobModal from "../components/AddJobModal";
import JobList from "../components/JobList";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  const handleAddJob = (newJob) => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Job Listings
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all your posted jobs in one place
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Job
          </button>
        </div>

        <JobList />

        <AddJobModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddJob}
        />
      </div>
    </div>
  );
}
