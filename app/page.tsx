import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function Home() {
  return (
    <div>
      Home Page
      Material Ui Test
      <Stack spacing={2} direction="row">
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
    </div>
  );
}
