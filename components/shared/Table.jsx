import { Container, Paper, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react'

const Table = ({ row, columns, rowHeight = 52, heading }) => {
    return (
        <Container
            sx={{ height: '100vh' }}
        >
            <Paper
            elevation={3}
            sx={{
                padding:'1rem 4rem',
                borderRadius:"1rem",
                margin:"auto",
                width:'100%',
                height:"100%",
                overflow:"hidden",
                boxShadow:'none'
            }}
            >
                <Typography
                variant='h4'
                sx={{
                    textAlign:'center',
                    margin:'2rem',
                    textTransform:"uppercase"
                }}
                >{heading}</Typography>
                <DataGrid 
                rows={row}
                columns={columns}
                rowHeight={rowHeight}
                style={{
                    height:'80%'
                }}
                sx={{
                    border:'none',
                    ".table-header":{
                        bgcolor:'rgba(0,0,0,0.9)',
                        color:'white'
                    },
                }}
                />
            </Paper>
        </Container>
    )
}

export default Table;