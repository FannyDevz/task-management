import {Link, router, usePage} from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// project imports
import config from '@/config';
import Logo from '@/ui-component/Logo';
import { MENU_OPEN } from '@/store/actions';
import Grid from "@mui/material/Grid";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const page = usePage().props;
  const settings = page.settings;
  // console.log(settings);
  const handleClick = () => {
    router.get(window.route('dashboard'));
  };
  const defaultId = useSelector((state) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <Grid container={true} sx={{ justifyContent: 'center' }}>
       {/*<ButtonBase disableRipple onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })} component={Link} to={config.defaultPath}>*/}
      <ButtonBase disableRipple onClick={handleClick}>
        {/*<Logo />*/}
        <img src={settings.instancelogo} alt="Logo" style={{maxHeight: 50, maxWidth: '100%'}}/>
      </ButtonBase>
    </Grid>
  );
};

export default LogoSection;
