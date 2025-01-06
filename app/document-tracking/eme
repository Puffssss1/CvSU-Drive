'use client'
import React, { useState } from 'react';
import Header from '@/components/Header';
import { supabase } from '../../lib/supabaseClient';

function Track() {
  const [reference, setReference] = useState<string>(''); // State to store reference number
  const [fileUrl, setFileUrl] = useState<string | null>(null); // State to store the file URL
  const [loading, setLoading] = useState<boolean>(false); // State to track loading state
  const [error, setError] = useState<string | null>(null); // State to store errors

  const handleReferenceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReference(event.target.value); 
  };

  const handleSearch = async () => {
    if (!reference) return;

    setLoading(true);
    setError(null);
    setFileUrl(null);

    try {
      // Query Supabase for the file metadata based on the reference number
      const { data, error } = await supabase
        .from('file_metadata')
        .select('file_url')
        .eq('reference', reference)
        .single(); // Assuming reference is unique

      if (error) throw error;

      if (data) {
        // Set the file URL if found
        setFileUrl(data.file_url);
      } else {
        setError('File not found.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* Title */}
      <div className="text-4xl m-5 bg-slate-200 p-4 font-bold font-mono ml-52">DOCUMENT TRACKING</div>

      {/* Search Form */}
      <div className="flex justify-center items-center">
        <div className="ml-56 flex flex-col items-center">
          <input
            type="text"
            id="Reference"
            placeholder="Enter Reference Number"
            value={reference}
            onChange={handleReferenceChange}
            className="border rounded-lg p-2 mb-4 w-80"
          />
          <button
            className="bg-[#004225] hover:bg-green-600 text-white rounded-3xl px-6 py-2"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Tracking Details Title */}
      <div className="text-4xl m-5 bg-slate-200 p-4 font-bold font-mono ml-52">TRACKING DETAILS</div>

      {/* Display Reference Number */}
      {reference && <div className="text-center font-bold">Reference: {reference}</div>}

      {/* Display File URL or Error */}
      <div className="text-center mt-4">
        {fileUrl && (
          <div>
            <p className="text-lg">File found:</p>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600">
              View File
            </a>
          </div>
        )}

        {error && <p className="text-red-500">{error}</p>}
      </div>

      {/* Horizontal Line */}
      <hr className="w-2/3 border-t-2 border-black border-opacity-10 mt-2 mx-auto" />

      {/* Tracking Events */}
      <div className="m-5 ml-56 space-y-4">
        <div className="flex">
          <div className="text-black opacity-50 mr-24">January 01 2025, 12:01 am</div>
          <div className="text-black">Uploading in CVSU Drive</div>
        </div>

        <div className="flex">
          <div className="text-black opacity-50 mr-24">January 01 2025, 12:01 am</div>
          <div className="text-black">Received by the Admin</div>
        </div>

        <div className="flex">
          <div className="text-black opacity-50 mr-24">January 01 2025, 12:01 am</div>
          <div className="text-black">Approved by the Admin</div>
        </div>

        <div className="flex">
          <div className="text-black opacity-50 mr-24">January 01 2025, 12:01 am</div>
          <div className="text-black">Uploaded in CVSU Drive</div>
        </div>
      </div>
    </div>
  );
}

export default Track;
