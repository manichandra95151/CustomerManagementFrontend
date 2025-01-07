import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "./Pagination";
import { Search } from "lucide-react";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    fetchCustomers();
  }, [debouncedSearch, filterField, filterValue, page]);

  const fetchCustomers = async () => {
    try {
      setLoading(true); // Start loading
      const response = await axios.get(`${backendUrl}`, {
        params: { page, limit, search: debouncedSearch, filterField, filterValue },
      });
      setCustomers(response.data.customers);
      setTotalPages(response.data.totalPages);
      setTotalRecords(response.data.total);
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterFieldChange = (e) => {
    setFilterField(e.target.value);
    setPage(1);
  };

  const handleFilterValueChange = (e) => {
    setFilterValue(e.target.value);
    setPage(1);
  };

  const handlePageChange = (direction) => {
    setPage((prevPage) => prevPage + direction);
  };

  return (
    <div className="min-h-screen bg-[#9984F8] p-8">
      <div className="max-w-6xl mx-auto bg-white/30 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Customer Management
        </h1>

        {/* Search Section */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="w-full max-w-2xl relative">
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={handleSearchChange}
              className="w-full bg-gray-50 border border-gray-300 rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 h-5 w-5" />
          </div>
          <div className="flex gap-4 w-full max-w-2xl flex-wrap">
            <select
              value={filterField}
              onChange={handleFilterFieldChange}
              className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 w-full sm:w-auto"
            >
              <option value="">Select Field</option>
              <option value="email">Email</option>
              <option value="mobile_number">Mobile Number</option>
            </select>
            <input
              type="text"
              value={filterValue}
              onChange={handleFilterValueChange}
              placeholder="Filter value"
              className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 w-full sm:w-auto"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="rounded-xl shadow-lg overflow-x-auto">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full table-auto">
              <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Mobile</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">DOB</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.length > 0 ? (
                  customers.map((customer, index) => (
                    <tr key={customer.s_no} className="transition-all duration-300 hover:scale-105 hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.s_no}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.name_of_customer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.mobile_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(customer.dob).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Section */}
        <div className="mt-8 flex justify-center gap-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="mt-4 text-center text-gray-600">
          Total Records: {totalRecords}
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
