import Head from 'next/head';
import NextLink from 'next/link';
import NextImage from 'next/image';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { styled } from '@mui/material/styles';

function NotFound() {
  return (
    <>
      <Head>
        <title>404 | CRUD dashboard</title>
      </Head>
      <Box
        component="main"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexGrow: 1,
          minHeight: '100%',
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              align="center"
              color="textPrimary"
              component="h1"
              variant="h2"
              sx={{ mt: 8, fontWeight: 'bold' }}
            >
              404: The page you are looking for isn’t here
            </Typography>
            <Typography
              align="center"
              color="textPrimary"
              variant="body1"
              sx={{ my: 2 }}
            >
              You either tried some shady route or you came here by mistake.
              Whichever it is, try using the navigation
            </Typography>
            <Box sx={{ textAlign: 'center', pt: 4 }}>
              <NextImage
                alt="Page not found"
                src="/undraw_not_found_-60-pq.svg"
                width="560"
                height="389"
                /* style={{
                  marginTop: 50,
                  display: 'inline-block',
                  maxWidth: '100%',
                }} */
              />
            </Box>
            <NextLink href="/" passHref>
              <Button
                startIcon={<ArrowBackIcon fontSize="small" />}
                sx={{ mt: 3 }}
                variant="contained"
                component="a"
              >
                Go back to home
              </Button>
            </NextLink>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default NotFound;
