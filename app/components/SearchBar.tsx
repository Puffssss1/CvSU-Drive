'use client';
import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import { createClient } from '@supabase/supabase-js';
import { Box, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

interface FileMetadata {
  id: string;
  file_name: string;
  file_url: string; // Include file_url in the interface
}

function SearchBar() {
  const { data: session } = useSession(); // Get the logged-in user session
  const [searchTerm, setSearchTerm] = useState<string>(''); // Search input state
  const [filteredFiles, setFilteredFiles] = useState<FileMetadata[]>([]); // Filtered files state
  const [loading, setLoading] = useState<boolean>(false); // Loading state for the request
  const [error, setError] = useState<string | null>(null); // Error state
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Dropdown visibility state
  const searchRef = useRef<HTMLInputElement | null>(null); // Reference to the search input

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
      // Query Supabase to get file metadata, filtering by the search term and uploaded_by
      const { data, error } = await supabase
        .from('file_metadata') // Your table name
        .select('id, file_name, file_url')
        .ilike('file_name', `%${search}%`) // Use ilike for case-insensitive search
        .eq('uploaded_by', session?.user?.name); // Filter by the current user

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

  // Handle focus on the search bar
  const handleFocus = () => {
    setDropdownOpen(true); // Open dropdown when focused
  };

  // Handle blur on the search bar
  const handleBlur = () => {
    setDropdownOpen(false); // Close dropdown when blurred
  };

  return (
    <div className="w-[65%] ml-[200px]" style={{ position: 'relative' }}>
      <TextField
        id="outlined-basic"
        variant="outlined"
        fullWidth
        label="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        onFocus={handleFocus} // Open dropdown on focus
        onBlur={handleBlur} // Close dropdown on blur
        sx={{
          '& .MuiOutlinedInput-root ': {
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

      {/* Dropdown for filtered results */}
      {dropdownOpen && filteredFiles.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%', // Position below the input
            left: 0,
            right: 0,
            backgroundColor: 'white',
            boxShadow: 3,
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto',
            borderRadius: '4px',
            mt: 1,
          }}
        >
          {filteredFiles.map((file) => (
            <Box
              key={file.id}
              sx={{
                padding: 1,
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#f0f0f0',
                },
              }}
              onClick={() => {
                window.location.href = file.file_url; // Redirect to file URL on click
                setDropdownOpen(false); // Close dropdown after selection
              }}
            >
              <Typography variant="body2">{file.file_name}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </div>
  );
}

export default SearchBar;