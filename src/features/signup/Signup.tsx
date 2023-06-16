import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Grid, Box, Typography, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { FC } from "react";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { AppDispatch } from "../../store/store";
import FormInput from "../../components/FormInput";
import { register } from "../../slices/login.slice";
import authService from "../../services/auth.service";
import { LinkItem, mainColor, secondaryColor, borderRadius, textColor } from "../login/Login";

import image from "./assets/plane.png";


// ? SignUp Schema with Zod
const signupSchema = object({
  name: string().min(1, "Name is required").max(70),
  email: string().min(1, "Email is required").email("Email is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
  passwordConfirm: string().min(1, "Please confirm your password"),
  phone: string().min(1, "Phone is required").max(70),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ["passwordConfirm"],
  message: "Passwords do not match",
});

// ? Infer the Schema to get TypeScript Type
type ISignUp = TypeOf<typeof signupSchema>;

const SignupPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();


  // ? Default Values
  const defaultValues: ISignUp = {
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
    phone: "",
  };

  // ? Object containing all the methods returned by useForm
  const methods = useForm<ISignUp>({
    resolver: zodResolver(signupSchema),
    defaultValues,
  });

  // ? Form Handler
  const onSubmitHandler: SubmitHandler<ISignUp> = async (values: ISignUp) => {
    const {name, email, password, passwordConfirm, phone} = values;

    dispatch(register(await authService.register(name, email, password, passwordConfirm, phone)))

    navigate("/");
  };

  // ? Returned JSX
  return (
    <Container
      maxWidth={false}
      sx={{ height: "100vh", backgroundColor: { xs: mainColor, md: secondaryColor }, color: textColor }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ width: "100%", height: "100%" }}
      >
        <Grid
          item
          sx={{ maxWidth: "70rem", width: "100%", backgroundColor: mainColor, borderRadius }}
        >
          <Grid
            container
            sx={{
              boxShadow: { sm: "0 0 5px #ddd" },
              py: "6rem",
              px: "1rem",
              borderRadius
            }}
          >
            <FormProvider {...methods}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  textAlign: "center",
                  width: "100%",
                  mb: "1.5rem",
                  pb: { sm: "3rem" },
                }}
              >
                Bienvenido a TravelAccountant
              </Typography>
              <Grid
                item
                container
                justifyContent="space-between"
                rowSpacing={5}
                sx={{
                  maxWidth: { sm: "45rem" },
                  marginInline: "auto",
                }}
              >
                <Grid
                  item
                  xs={12}
                  sm={6}
                  sx={{ borderRight: { sm: "1px solid #ddd" } }}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    component="form"
                    noValidate
                    autoComplete="off"
                    sx={{ paddingRight: { sm: "3rem" } }}
                    onSubmit={methods.handleSubmit(onSubmitHandler)}
                  >
                    <Typography
                      variant="h6"
                      component="h1"
                      sx={{ textAlign: "center", mb: "1.5rem" }}
                    >
                      Create new your account
                    </Typography>

                    <FormInput
                      label="Name"
                      type="text"
                      name="name"
                      focused
                      required
                    />
                    <FormInput
                      label="Enter your email"
                      type="email"
                      name="email"
                      focused
                      required
                    />
                    <FormInput
                      type="password"
                      label="Password"
                      name="password"
                      required
                      focused
                    />
                    <FormInput
                      type="password"
                      label="Confirm Password"
                      name="passwordConfirm"
                      required
                      focused
                    />
                    <FormInput
                      type="phone"
                      label="Phone Number"
                      name="phone"
                      required
                      focused
                    />

                    <LoadingButton
                      loading={false}
                      type="submit"
                      variant="contained"
                      sx={{
                        py: "0.8rem",
                        mt: 2,
                        width: "80%",
                        marginInline: "auto",
                        backgroundColor: 'var(--color-bg-header-card)'
                      }}
                    >
                      Sign Up
                    </LoadingButton>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    sx={{ paddingLeft: { sm: "3rem" }, rowGap: "1rem" }}
                  >
                    <img src={image} alt=""/>
                  </Box>
                </Grid>
              </Grid>
              <Grid container justifyContent="center">
                <Stack sx={{ mt: "3rem", textAlign: "center" }}>
                  <Typography sx={{ fontSize: "0.9rem", mb: "1rem" }}>
                    Already have an account? <LinkItem to="/">Login</LinkItem>
                  </Typography>
                </Stack>
              </Grid>
            </FormProvider>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SignupPage;
