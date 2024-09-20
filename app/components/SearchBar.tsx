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
        />
    </div>
  )
}

export default SearchBar