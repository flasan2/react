import { Box, Paper, Typography } from '@mui/material';
import { RadarChart } from '@mui/x-charts/RadarChart';

export default function Dashboard() {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      <Paper sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Desempenho de exemplo (Lisa)
        </Typography>

        <RadarChart
          height={300}
          series={[
            {
              label: 'Lisa',
              data: [120, 98, 86, 99, 85, 65],
            },
          ]}
          radar={{
            max: 120,
            metrics: ['Math', 'Chinese', 'English', 'Geography', 'Physics', 'History'],
          }}
        />
      </Paper>
    </Box>
  );
}
