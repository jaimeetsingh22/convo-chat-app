'use client'
import { Grid, Skeleton, Stack, CssBaseline, Box } from "@mui/material";

export function LoadingComponent() {
  return (
    <>
      <CssBaseline />

      {/* Top Navbar Skeleton */}
      <Box sx={{ height: "4rem", bgcolor: "rgba(0,0,0,0.1)" }}>
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </Box>

      <Grid container height={"calc(100vh - 4rem)"}>

        {/* Left Sidebar - Chat List Skeleton */}
        <Grid
          item
          sm={4}
          md={3}
          sx={{
            display: { xs: "none", sm: "block" },
            bgcolor: "ButtonShadow",
            overflowY: "auto",
            padding: "1rem",
          }}
          height={"100%"}
        >
          {/* Simulate chat list */}
          {Array.from(new Array(10)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={60}
              width="100%"
              sx={{ mb: 2 }}
            />
          ))}
        </Grid>

        {/* Center - Alternative Left and Right Chat Messages Skeleton */}
        <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} padding="1rem">
          {/* Simulate alternating chat bubbles (left and right) */}
          {Array.from(new Array(10)).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={40}
              width={index % 2 === 0 ? "40%" : "60%"}
              sx={{
                mb: 2,
                marginLeft: index % 2 === 0 ? "0" : "auto",
                marginRight: index % 2 === 0 ? "auto" : "0",
                borderRadius: '1rem'
              }}
            />
          ))}
        </Grid>

        {/* Right Sidebar - Profile Skeleton */}
        <Grid
          item
          md={4}
          lg={3}
          height={"100%"}
          sx={{
            display: { xs: "none", md: "block" },
            padding: "2rem",
            bgcolor: "rgba(0,0,0,0.8)",
          }}
        >
          {/* Simulate avatar */}
          <Skeleton
            variant="circular"
            width="10rem"
            height="10rem"
            sx={{ mb: 2, mx: "auto" }}
          />
          {/* Simulate about text with icon */}
          <Stack direction="column" spacing={2} alignItems="center">
            {Array.from(new Array(3)).map((_, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="center">
                {/* Circle icon */}
                <Skeleton variant="circular" width={16} height={16} />
                {/* Text line */}
                <Skeleton variant="text" width={80} height={20} />
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
