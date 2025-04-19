"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function JobListPage() {
  const [jobs, setJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [jobType, setJobType] = useState("");

  useEffect(() => {
    const currentPage = Number(searchParams.get("page")) || 1;
    const currentType = searchParams.get("type") || "";

    setPage(currentPage);
    setJobType(currentType);
  }, [searchParams]);

  useEffect(() => {
    async function fetchJobs() {
      const query = new URLSearchParams();
      query.append("page", String(page));
      query.append("limit", "5");
      if (jobType) query.append("type", jobType);

      const res = await fetch(`/api/jobs/all?${query.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotalPages(data.totalPages || 1);
    }

    fetchJobs();
  }, [page, jobType]);

  const handleFilterChange = (selectedType) => {
    const query = new URLSearchParams();
    if (selectedType) query.set("type", selectedType);
    query.set("page", "1");
    router.push(`?${query.toString()}`);
  };

  const handlePageChange = (pageNum) => {
    const query = new URLSearchParams(searchParams.toString());
    query.set("page", pageNum.toString());
    router.push(`?${query.toString()}`);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-10 text-center text-blue-700">
        ✨ Job Listings
      </h1>

      <div className="mb-8 flex flex-wrap">
        <select
          value={jobType}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="px-4 py-2 border rounded-lg text-sm"
        >
          <option value="">All Job Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
          <option value="Remote">Remote</option>
        </select>
      </div>

      <div className="space-y-6">
        {jobs.length === 0 ? (
          <p className="text-gray-600 text-center">No jobs available.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Job Title
                  </label>
                  <p className="text-lg font-semibold text-gray-800">
                    {job.title}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Company
                  </label>
                  <p className="text-gray-700">{job.company}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Location
                  </label>
                  <p className="text-gray-700">{job.location}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Job Type
                  </label>
                  <p className="text-gray-700">{job.jobType}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Posted On
                  </label>
                  <p className="text-gray-700">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-gray-700 mt-1">{job.description}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 border rounded-xl text-sm font-medium transition ${
                page === index + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
