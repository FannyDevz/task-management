// material-ui
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const AuthFooter = () => (
  <Stack direction="row" justifyContent="space-between">
    <Typography variant="subtitle2" component={Link} href="https://digitalku.com" target="_blank" underline="hover">
      Powered by Digitalku
    </Typography>
    <Typography variant="subtitle2" component={Link} href="https://digitalku.com" target="_blank" underline="hover">
      &copy; Digitalku
    </Typography>
  </Stack>
);

export default AuthFooter;
