import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function LoginBtn() {
  return (
    <div>
      Material Ui Test
      <Stack spacing={2} direction="row">
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
    </div>
  );
}

export default LoginBtn;
