import React from 'react';

const Unauthorized = () => {
  const goBack = () => {
    window.history.back(); // Navigate back using browser history
  };

  const goToHomepage = () => {
    window.location.href = '/'; // Redirect to homepage
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <line x1="16.5" y1="7.5" x2="7.5" y2="16.5" />
              <line x1="7.5" y1="7.5" x2="16.5" y2="16.5" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Sorry, you don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={goBack}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {/* Back arrow icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>

          <button
            onClick={goToHomepage}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            Return to Homepage
          </button>
        </div>

        {/* Error Code */}
        <div className="mt-8 text-sm text-gray-500">
          Error Code: 401 - Unauthorized Access
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;