import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Link, usePage  } from '@inertiajs/react';

// material-ui
import { useTheme } from '@mui/material/styles';

// assets
import {Alert} from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import {WarningAmber} from "@mui/icons-material";

// ==============================|| BREADCRUMBS TITLE ||============================== //
const Alerts = ({flash}) => {
  const theme = useTheme();

  useEffect(() => {
    if (flash) {
      setVisible(true);
    }
  }, [flash]);


  const [visible, setVisible] = useState(true);
  const handleClose = () => {

    setVisible(false);

  };

  let alertContent = null;

  if (visible && flash && flash.message?.type === 'success') {
    alertContent = (
      <Alert sx={{mb : 2}} icon={<CheckIcon fontSize="inherit" />} severity="success"
             onClose={handleClose}>
        {flash.message.text}
      </Alert>
    );
  }
  else if (visible && flash && flash.message?.type === 'error') {
    alertContent = (
      <Alert sx={{mb : 2}} icon={<WarningAmber fontSize="inherit" />} severity="error"
             onClose={handleClose}>
        {flash.message.text}
      </Alert>
    );
  }

  return alertContent;
};

Alerts.propTypes = {
  flash : PropTypes.object,
};

export default Alerts;
