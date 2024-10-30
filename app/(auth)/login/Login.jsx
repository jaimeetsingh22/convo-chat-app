'use client'
import { useFileHandler, useInputValidation } from '6pp';
import { LoadingComponent } from '@/components/LoadingsComponent/Loading';
import { VisuallyHiddenInput } from '@/components/styles/StyledComponent';
import { usernameValidor } from '@/utils/usernameValidator';
import { CameraAlt as CameraAltIcon } from '@mui/icons-material';
import { Avatar, Button, Container, CssBaseline, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { signIn, useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setisLogin] = useState(true);
  const name = useInputValidation("");
  const username = useInputValidation("", usernameValidor);
  const password = useInputValidation("");
  const bio = useInputValidation("");
  const avatar = useFileHandler('single');
  const router = useRouter();
  const { status } = useSession();
  const [isTrue, setIsTrue] = useState(false);
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace("/");
    }
  }, [status, router]);

  if (status === 'authenticated' || status === "loading") {
    return <LoadingComponent />;
  }
  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name.value);
    formData.append('username', username.value);
    formData.append('password', password.value);
    formData.append('bio', bio.value);
    if (avatar.file) {
      formData.append('avatar', avatar.file);
    }
    setIsTrue(true);

    try {
      const res = await axios.post('/api/new-user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = res.data;
      if (res.status === 201) {
        toast.success(data.message);
        const signInRes = await signIn('credentials', {
          username: username.value,
          password: password.value,
          redirect: false,
        });
        if (signInRes.error !== "Configuration" && signInRes.ok) {
          router.push("/");
        }
      }
    } catch (error) {
      console.error(error);
      setIsTrue(false);
      if (error.response) {
        if (error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            toast.error(`${err.field}: ${err.message}`);
          });
        } else if (error.response.data.message) {
          toast.error(error.response.data.message);
        }
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const handleLogin = async (e) => {
    setIsTrue(true);
    e.preventDefault();
    try {
      const res = await signIn('credentials', {
        username: username.value,
        password: password.value,
        redirect: false,
      });

      if (res.error !== "Configuration" && res.ok) {
        router.push("/");
      } else {
        setIsTrue(false);
        toast.error('Invalid email or password');
      }
    } catch (error) {
      setIsTrue(false);
      console.error(error);
    }
  };

  return isLogin ? <>
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
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark semi-transparent background
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
              Sign in
            </Typography>
          </motion.div>
          <form onSubmit={handleLogin}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                type='text'
                autoFocus
                variant='outlined'
                value={username.value}
                onChange={username.changeHandler}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'white' }
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password.value}
                onChange={password.changeHandler}
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
                sx={{
                  mt: 3, mb: 1,
                  cursor: isTrue ? "wait" : "pointer",
                }}
                disabled={isTrue}
              >
                Log In
              </Button>
              <Typography sx={{ justifyContent: 'center', display: 'flex' }}>Or</Typography>
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 1, color: 'white' }}
                onClick={() => setisLogin(false)}
              >
                Sign Up
              </Button>
            </motion.div>
          </form>
        </Paper>
      </Container>
    </motion.div>
  </> : <>
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
        <Paper
          elevation={3}
          sx={{
            padding: "1.5rem",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark semi-transparent background
            backdropFilter: 'blur(10px)', // Blurred background
            color: 'white'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h5" marginBottom={'1rem'}>
              Sign Up
            </Typography>
          </motion.div>
          <form style={{ width: '75%' }} onSubmit={handleSignup}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Stack width={"10rem"} margin={'auto'} position={'relative'}>
                <Avatar sx={{
                  width: '10rem',
                  height: '10rem',
                  objectFit: 'contain',
                  marginBottom: '1rem'
                }}
                  src={avatar.preview}
                />
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: '0rem',
                    right: '0rem',
                    bgcolor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    ":hover": {
                      bgcolor: 'rgba(0,0,0,0.7)'
                    }
                  }}>
                  <>
                    <CameraAltIcon />
                    <VisuallyHiddenInput type="file" onChange={avatar.changeHandler} />
                  </>
                </IconButton>
              </Stack>
              {
                avatar.error && (
                  <Typography width={'fit-content'}
                    m={'1rem auto'}
                    display={'block'} color={'error'} variant='caption'>
                    {avatar.error}
                  </Typography>
                )
              }
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                autoFocus
                type='text'
                variant='outlined'
                value={name.value}
                onChange={name.changeHandler}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'white' }
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                variant='outlined'
                value={username.value}
                onChange={username.changeHandler}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'white' }
                }}
              />
              {
                username.error && (
                  <Typography color={'error'} variant='caption'>
                    {username.error}
                  </Typography>
                )
              }
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password.value}
                onChange={password.changeHandler}
                InputProps={{
                  style: { color: 'white' }
                }}
                InputLabelProps={{
                  style: { color: 'white' }
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <TextField
                margin="normal"
                placeholder='Hey there I am using Convo!'
                fullWidth
                name="bio"
                label="Bio"
                type="text"
                id="Bio"
                autoComplete="current-Bio"
                value={bio.value}
                onChange={bio.changeHandler}
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
                sx={{
                  mt: 3, mb: 1,
                  cursor: isTrue ? "wait" : "pointer",
                }}
                disabled={isTrue}
              >
                Sign Up
              </Button>
              <Typography sx={{ justifyContent: 'center', display: 'flex' }}>Or</Typography>
              <Button
                fullWidth
                variant="text"
                sx={{ mt: 1, color: 'white' }}
                onClick={() => setisLogin(true)}
              >
                Log In
              </Button>
            </motion.div>
          </form>
        </Paper>
      </Container>
    </motion.div>
  </>
};

export default Login;
