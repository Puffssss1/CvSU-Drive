'use client';

import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Header from '@/components/Header';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);
interface Folder {
    id: string;
    file_name: string;
    file_url: string;
    referenceId: string;
    uploaded_at: string;
    uploaded_by: string;
  }

function LogHistory() {
  const [rows, setRows] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
        .from('file_metadata')
          .select('*');

        if (error) {
          throw error;
        }

        setRows(data || []);
      } catch (err) {
        setError('Failed to fetch data from Supabase');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="fixed w-full top-0 z-50">
        <Header />
      </div>
      <TableContainer
        component={Paper}
        sx={{
          margin: '10px',
        }}
      >
        <div className="overflow-x-auto mt-28">
          <h1 className="font-bold text-3xl ml-52">LOG HISTORY</h1>
          {loading ? (
            <p className="ml-52 mt-4 text-green-800">Loading...</p>
          ) : error ? (
            <p className="ml-52 mt-4 text-red-800">{error}</p>
          ) : (
            <div>
              <Table
              className="ml-52 table-fixed w-full mt-4"
              sx={{ minWidth: 100 }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left" className="font-bold text-green-800" sx={{ width: '15%' }}>
                    Name
                  </TableCell>
                  <TableCell align="left" className="font-bold text-green-800" sx={{ width: '20%' }}>
                    Reference Number
                  </TableCell>
                  <TableCell align="left" className="font-bold text-green-800" sx={{ width: '10%' }}>
                    Date
                  </TableCell>
                  <TableCell align="left" className="font-bold text-green-800" sx={{ width: '20%' }}>
                    File Link
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.file_name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.uploaded_by}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '15%' }}>
                      {row.referenceId}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '15%' }}>
                      {row.uploaded_at}
                    </TableCell>
                    <TableCell align="left" sx={{ width: '15%' }}>
                      {row.file_url}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
            
          )}
        </div>
      </TableContainer>
    </div>
  );
}

export default LogHistory;
