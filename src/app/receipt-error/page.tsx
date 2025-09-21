'use client';

export default function ReceiptError() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-4">Receipt Not Found</h1>
        <p className="text-gray-600 mb-6">
          This receipt link is invalid, expired, or no longer available.
        </p>
        <div className="space-y-3">
          {/*<a*/}
          {/*  href="/"*/}
          {/*  className="block w-full bg-blue-500 text-white py-3 px-4 rounded font-semibold hover:bg-blue-600 transition-colors"*/}
          {/*>*/}
          {/*  Generate New Receipt*/}
          {/*</a>*/}
          <button
            onClick={() => window.history.back()}
            className="block w-full bg-gray-200 text-gray-700 py-3 px-4 rounded font-semibold hover:bg-gray-300 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}