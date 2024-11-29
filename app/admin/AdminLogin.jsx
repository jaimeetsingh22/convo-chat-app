'use client';
import { useInputValidation } from '6pp';
import { setAdmin, setError } from '@/redux/reducers/auth';
import { verifyAdmin, fetchAdmin } from '@/utils/adminAuthApi';
import { Button, Container, CssBaseline, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

const AdminLogin = () => {
    const secretKey = useInputValidation("");
    const { isAdmin } = useSelector((state) => state.auth);
    const [disable, setDisable] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);
        setDisable(true);
        const config = { withCredentials: true, headers: { "Content-Type": "application/json" } };

        try {
            const {data} = await axios.post("/api/admin/verify", { secreteKey : secretKey.value }, config);
            // console.log(data);
            if (data.success) {
                dispatch(setAdmin(true));
                toast.success(data.message);
                router.push('/admin/dashboard');
            }
        } catch (error) {
            console.log(error);
            dispatch(setError(error.message));
            console.log(error.message)
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
            setDisable(false);
        }
    }, [dispatch, router, secretKey.value]);

    const fetchAdminData = useCallback(async () => {
        const res = await fetchAdmin();
        console.log(res)
        if (res) { dispatch(setAdmin(res.admin)); }
    }, [dispatch]);

    useEffect(() => {
        fetchAdminData();
    }, [fetchAdminData]);

    // Redirect if already logged in
    useEffect(() => {
        if (isAdmin) {
            router.push('/admin/dashboard');
        }
    }, [isAdmin, router]);

    // Prevent rendering if already logged in
    if (isAdmin) return null;

    return (
        <div style={{ background: 'black' }}>
            <Toaster />
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
                            backgroundColor: 'rgba(250 , 250, 250, 0.2)',
                            backdropFilter: 'blur(10px)',
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
                                    disabled={disable || loading}
                                >
                                    {loading ? <CircularProgress size={24} /> : 'Log In'}
                                </Button>
                            </motion.div>
                        </form>
                    </Paper>
                </Container>
            </motion.div>
        </div>
    );
}

export default AdminLogin;