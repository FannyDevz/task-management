import { Head, Link } from '@inertiajs/react';

// material-ui
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';

// project imports
import AuthWrapper from '../AuthWrapper.jsx';
import AuthCardWrapper from '../AuthCardWrapper';
import AuthLogin from '@/pages/Auth/Forms/AuthLogin';
import Logo from '@/ui-component/Logo';
import AuthFooter from '@/ui-component/cards/AuthFooter';
import React from 'react';

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = ({...props}) => {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <AuthWrapper>
      <Head>
        <title>Login - Digikarir</title>
        <meta name='description' content='login page for digikarir' />
      </Head>
      <Grid
        container
        direction='column'
        justifyContent='flex-end'
        sx={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent='center'
            alignItems='center'
            sx={{ minHeight: 'calc(100vh - 68px)' }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  alignItems='center'
                  justifyContent='center'
                >
                  {/*<Grid item sx={{ mb: 3 }}>*/}
                  {/*  <Link href="#" aria-label="logo">*/}
                  {/*    <Logo />*/}
                  {/*  </Link>*/}
                  {/*</Grid>*/}
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={{
                        xs: 'column-reverse',
                        md: 'row',
                      }}
                      alignItems='center'
                      justifyContent='center'
                    >
                      <Grid item>
                        <Stack
                          alignItems='center'
                          justifyContent='center'
                          spacing={1}
                        >
                          <Typography
                            color='secondary.main'
                            gutterBottom
                            variant={downMD ? 'h3' : 'h2'}
                          >
                            Hi, Welcome Back
                          </Typography>
                          <Typography
                            variant='caption'
                            fontSize='16px'
                            textAlign={{
                              xs: 'center',
                              md: 'inherit',
                            }}
                          >
                            Enter your credentials to continue
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <AuthLogin errors={props.errors} />
                  </Grid>
                  {/*<Grid item xs={12}>*/}
                  {/*  <Divider />*/}
                  {/*</Grid>*/}
                  {/*<Grid item xs={12}>*/}
                  {/*  <Grid item container direction="column" alignItems="center" xs={12}>*/}
                  {/*    <Typography component={Link} href={route('register')} variant="subtitle1" sx={{ textDecoration: 'none' }}>*/}
                  {/*      Don&apos;t have an account?*/}
                  {/*    </Typography>*/}
                  {/*  </Grid>*/}
                  {/*</Grid>*/}
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Login;
