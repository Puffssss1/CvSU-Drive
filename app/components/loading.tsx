import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';

function Loading() {
return (
    <div className="flex items-center justify-center h-screen">
        <CircularProgress />
    </div>
)
}

export default Loading