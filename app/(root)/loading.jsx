
import { Grid, Skeleton, Stack } from '@mui/material';

const Loading = () => {
    return (
        <Grid container height={"calc(100vh - 4rem)"} justifyContent="center" alignItems="center" overflow="hidden">
            <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                height={'100%'}
            >
                <Stack spacing={'1rem'}>
                    {
                        Array.from({ length: 10 }).map((_, index) => (
                            <Grid
                                container
                                justifyContent={index % 2 === 0 ? 'flex-start' : 'flex-end'}
                                key={index}
                            >
                                <Skeleton 
                                    variant="rounded" 
                                    width={'40vw'} 
                                    height={'5vh'} 
                                    style={{ margin: '0.5rem',borderRadius:'1rem' }} 
                                />
                            </Grid>
                        ))
                    }
                </Stack>
            </Grid>
        </Grid>
    )
}

export default Loading;
