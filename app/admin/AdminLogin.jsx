'use client'
import { useInputValidation } from '6pp';
import { Button, Container, CssBaseline, Paper, TextField, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

// later i will add skeleton for the loading components

const AdminLogin = () => {
    const secretKey = useInputValidation("");
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    
    setIsAdmin(true)
    
    const handleSubmit = async (e) => {
        e.preventDefault();

    }

    if(isAdmin) return router.push('/admin/dashboard')
    
    return (
        <div style={{background:'black'}}>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',

            }}
        >
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(250 , 250, 250, 0.2)', // Dark semi-transparent background
                        backdropFilter: 'blur(10px)', // Blurred background
                        color: 'white'
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Typography variant="h5" mb={'1rem'}>
                          Admin Login
                        </Typography>
                    </motion.div>
                    <form onSubmit={handleSubmit}>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="secretkey"
                                label="Secret Key"
                                type="password"
                                id="secretkey"
                                value={secretKey.value}
                                onChange={secretKey.changeHandler}
                                InputProps={{
                                    style: { color: 'white' }
                                }}
                                InputLabelProps={{
                                    style: { color: 'white' }
                                }}
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 1 }}
                            >
                                Log In
                            </Button>
                        </motion.div>
                    </form>
                </Paper>
            </Container>
        </motion.div>
        </div>
    )
}

export default  AdminLogin;