import { Box, Container, Paper, Skeleton, Stack } from "@mui/material";

const DashboardSkeleton = () => (
    <Container component={'main'}>
      {/* Skeleton for AppBar */}
      <Paper
        elevation={3}
        sx={{
          padding: '2rem',
          margin: '2rem 0',
          borderRadius: "1rem"
        }}
      >
        <Stack direction={'row'} alignItems={"center"} spacing={'1rem'}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width="30%" height={40} />
          <Skeleton variant="rectangular" width="10%" height={40} />
          <Box flexGrow={1} />
          <Skeleton variant="text" width="20%" height={30} />
          <Skeleton variant="circular" width={40} height={40} />
        </Stack>
      </Paper>
  
      {/* Skeleton for Widgets */}
      <Stack
        direction={{
          xs: 'column',
          sm: "row"
        }}
        justifyContent={'space-between'}
        alignItems={'center'}
        spacing={2}
        margin={'2rem 0'}
      >
        {Array.from({ length: 3 }).map((_, index) => (
          <Paper
            key={index}
            elevation={3}
            sx={{
              padding: '2rem',
              borderRadius: "2rem",
              width: '20rem',
              margin: '2rem 0'
            }}
          >
            <Stack alignItems={'center'} spacing={1}>
              <Skeleton variant="circular" width={80} height={80} />
              <Skeleton variant="text" width="60%" />
            </Stack>
          </Paper>
        ))}
      </Stack>
  
      {/* Skeleton for Charts */}
      <Stack
        direction={{
          xs: 'column',
          lg: "row"
        }}
        sx={{
          gap: '2rem'
        }}
        justifyContent={'center'}
        alignItems={{
          xs: 'center',
          lg: "stretch"
        }}
        flexWrap={'wrap'}
      >
        <Paper
          elevation={3}
          sx={{
            padding: '2rem 3.5rem',
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "45rem",
          }}
        >
          <Skeleton variant="text" width="40%" height={40} sx={{ marginBottom: "2rem" }} />
          <Skeleton variant="rectangular" width="100%" height={200} />
        </Paper>
  
        <Paper
          elevation={3}
          sx={{
            padding: '1rem',
            borderRadius: "1rem",
            width: "100%",
            maxWidth: "25rem",
            display: "flex",
            alignItems: 'center',
            justifyContent: "center",
            position: "relative",
            width: {
              xs: "100%",
              sm: '50%'
            },
          }}
        >
          <Skeleton variant="circular" width={150} height={150} />
        </Paper>
      </Stack>
    </Container>
  );

  export default DashboardSkeleton