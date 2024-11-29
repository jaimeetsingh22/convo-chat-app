'use client';

import { Box, Stack, Typography, Grid, Skeleton } from '@mui/material';

const GroupsLoadingSkeleton = () => {
  const renderSkeletonItem = (index) => (
    <Stack
      direction="row"
      key={index}
      spacing={2}
      alignItems="center"
      padding="0.5rem"
      sx={{
        borderRadius: '10px 0px 10px 0px',
        margin: '0.5rem',
        backgroundColor: '#f0f0f0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Skeleton variant="circular" width={50} height={50} />
      <Skeleton variant="text" width="60%" height={20} />
    </Stack>
  );

  const renderSidebarSkeleton = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        gap: '1rem',
        background: '#f5f5f5',
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width="100%"
          height={60}
          sx={{
            borderRadius: '10px 0px 10px 0px',
          }}
        />
      ))}
    </Box>
  );

  const renderMainSkeleton = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        height: '100vh',
      }}
    >
      <Skeleton variant="text" width="50%" height={50} sx={{ marginBottom: '2rem' }} />
      <Typography variant="h6" sx={{ marginBottom: '1rem' }}>
        <Skeleton width="30%" />
      </Typography>
      <Stack
        spacing={2}
        width="100%"
        height="50vh"
        sx={{
          overflowY: 'auto',
          padding: '1rem',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {Array.from({ length: 6 }).map((_, index) => renderSkeletonItem(index))}
      </Stack>
      <Stack
        direction={{
          sm: 'row',
          xs: 'column-reverse',
        }}
        spacing={2}
        padding="1rem"
      >
        <Skeleton variant="rectangular" width={200} height={50} sx={{ borderRadius: 5 }} />
        <Skeleton variant="rectangular" width={200} height={50} sx={{ borderRadius: 5 }} />
      </Stack>
    </Box>
  );

  return (
    <Grid container height="100vh">
      <Grid item sm={4} xs={12}>
        {renderSidebarSkeleton()}
      </Grid>
      <Grid item sm={8} xs={12}>
        {renderMainSkeleton()}
      </Grid>
    </Grid>
  );
};

export default GroupsLoadingSkeleton;
