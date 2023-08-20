import styled from '@emotion/styled';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Container,
  Grid,
  Box,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { literal, object, string, TypeOf } from 'zod';

import FormInput from '../../components/FormInput';

import image from './assets/plane.png';
import { forgotPassword } from '../../slices/login.slice';
import authService from '../../services/auth.service';

export const mainColor = 'var(--color-bg-card)';
export const secondaryColor = '#0a1014';
export const textColor = '#e9edef';
export const borderRadius = '60px';

// ? Styled React Route Dom Link Component
export const LinkItem = styled(Link)`
  text-decoration: none;
  color: #3683dc;
  &:hover {
    text-decoration: underline;
    color: #5ea1b6;
  }
`;

// ? Login Schema with Zod
const forgotPasswordSchema = object({
  email: string().min(1, 'Email is required').email('Email is invalid'),
});

// ? Infer the Schema to get the TS Type
type IFPassword = TypeOf<typeof forgotPasswordSchema>;

const ForgotPassword: FC = () => {
  // ? Default Values
  const defaultValues: IFPassword = {
    email: '',
  };

  const dispatch = useDispatch();

  // ? The object returned from useForm Hook
  const methods = useForm<IFPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues,
  }); 

  // ? Submit Handler
  const onSubmitHandler: SubmitHandler<IFPassword> = async (values: IFPassword) => {
    const { email } = values;

    dispatch(forgotPassword(await authService.forgotPassword(email)));
  };

  // ? JSX to be rendered
  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundColor: { xs: mainColor, md: secondaryColor },
      }}
    >
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        sx={{ width: '100%', height: '100%', borderRadius: '20px' }}
      >
        <Grid
          item
          sx={{
            maxWidth: '70rem',
            width: '100%',
            backgroundColor: mainColor,
            borderRadius: borderRadius,
          }}
        >
          <FormProvider {...methods}>
            <Grid
              container
              sx={{
                boxShadow: { sm: '0 0 5px #ddd' },
                borderRadius: borderRadius,
                py: '6rem',
                px: '1rem',
              }}
            >
              <Grid
                item
                container
                justifyContent='space-between'
                rowSpacing={5}
                sx={{
                  maxWidth: { sm: '45rem' },
                  marginInline: 'auto',
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ borderRight: { sm: '1px solid #ddd' } }}
                >
                  <Box
                    display='flex'
                    flexDirection='column'
                    component='form'
                    noValidate
                    autoComplete='off'
                    sx={{ paddingRight: { sm: '3rem' } }}
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >
                    <Typography
                      variant='h6'
                      component='h1'
                      sx={{
                        textAlign: 'center',
                        mb: '1.5rem',
                        color: textColor,
                      }}
                    >
                      Type in your email
                    </Typography>

                    <FormInput
                      label='Enter your email'
                      type='email'
                      name='email'
                      focused
                      required
                    />

                    <LoadingButton
                      loading={false}
                      type='submit'
                      variant='contained'
                      sx={{
                        py: '0.8rem',
                        mt: 2,
                        width: '80%',
                        marginInline: 'auto',
                        backgroundColor: 'var(--color-bg-header-card)'
                      }}
                    >
                      Reset Password
                    </LoadingButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    display='flex'
                    flexDirection='column'
                    sx={{ paddingLeft: { sm: '3rem' }, rowGap: '1rem' }}
                    height='100%'
                    width='100%'
                  >
                    <img
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%',
                      }}
                      src={image}
                      alt=''
                    />
                  </Box>
                </Grid>
              </Grid>
              <Grid container justifyContent='center'>
                <Stack sx={{ mt: '3rem', textAlign: 'center', color: textColor }}>
                  <Typography sx={{ fontSize: '0.9rem', mb: '1rem' }}>
                    Need an account?{' '}
                    <LinkItem to='/signup'>Sign up here</LinkItem>
                  </Typography>
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    Login
                    <LinkItem to='/'>here</LinkItem>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </FormProvider>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
