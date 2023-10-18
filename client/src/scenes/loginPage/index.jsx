import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Social Code
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
        Welcome to Social Code, where you can Connect, Collaborate, and Create with other Developers!
        </Typography>
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem", color: "red" }}>
        Currently hosted on Netlify.  Initial login may take up to 45 seconds.
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;