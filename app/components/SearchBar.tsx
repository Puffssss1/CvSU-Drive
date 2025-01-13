'use client'
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { createClient } from '@supabase/supabase-js'; // Ensure your Supabase client is properly configured

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface FileMetadata {
  id: string;
  fileName: string;
}

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search input state
  const [filteredFiles, setFilteredFiles] = useState<FileMetadata[]>([]); // Filtered files state
  const [loading, setLoading] = useState<boolean>(false); // Loading state for the request
  const [error, setError] = useState<string | null>(null); // Error state

  // Debounce function to delay the search request after typing stops
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(args), delay);
    };
  };

  // Function to fetch files from Supabase based on the search term
  const fetchFiles = async (search: string) => {
    setLoading(true);
    setError(null);

    try {
      // Query Supabase to get file metadata, filtering by the search term
      const { data, error } = await supabase
        .from('file_metadata') // Your table name
        .select('id, file_name')
        .ilike('file_name', `%${search}%`); // Use ilike for case-insensitive search

      if (error) {
        throw new Error(error.message);
      }

      setFilteredFiles(data || []); // Set filtered files state with the result
    } catch (err: any) {
      setError(err.message); // Set error state if there's an issue
    } finally {
      setLoading(false); // Set loading to false when the request finishes
    }
  };

  // Use debounce to delay the fetchFiles call until the user stops typing
  const debouncedFetchFiles = debounce(fetchFiles, 500); // 500ms debounce delay

  // Handle input changes in the search bar
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value); // Update search term
    debouncedFetchFiles(value); // Call the debounced fetch function
  };

  return (
    <div className="w-[65%] ml-[200px]">
      <TextField
        id="outlined-basic"
        variant="outlined"
        fullWidth
        label="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#6A669D', // Default border color
            },
            '&:hover fieldset': {
              borderColor: '#6A669D', // Hover state border color
            },
            '&.Mui-focused fieldset': {
              borderColor: '#6A669D', // Focused state border color
            },
          },
        }}
      />
      {loading && <p>Loading...</p>} {/* Display loading message */}
      {error && <p>Error: {error}</p>} {/* Display error message */}

      {/* Display filtered results */}
      <div className='ml-[320px]'>
        <ul>
          {filteredFiles.map((file) => (
            <li key={file.id}>{file.fileName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchBar;
