import React from 'react'
import { useState } from "react";
import TextField from "@mui/material/TextField";

function SearchBar() {
  return (
    <div className='w-[65%]'>
        <TextField 
            id='outlined-basic'
            variant='outlined'
            fullWidth
            label='Search'
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
    </div>
  )
}

export default SearchBar