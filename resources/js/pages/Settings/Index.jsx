import React, {useEffect, useState} from "react";
import { Head, router } from "@inertiajs/react";

//@mui
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import TableSortLabel from '@mui/material/TableSortLabel';
import Button from '@mui/material/Button';
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import {Dialog, DialogActions, DialogContent, DialogTitle, FormLabel, Input, MenuItem, Select} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";

//components
import MainCard from "@/ui-component/cards/MainCard.jsx";
import MainLayout from "@/layout/MainLayout";

//utils
import { formatDate } from "@/utils/dateId";

//third party
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Grid from "@mui/material/Grid";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility.js";
import VisibilityOff from "@mui/icons-material/VisibilityOff.js";
import FormHelperText from "@mui/material/FormHelperText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const SettingsPage = ({ setting , user_auth, user_permissions}) => {
  const [currentLogo, setCurrentLogo] = useState('');
  const [newLogo, setNewLogo] = useState('');
  const getSettingLabel = (key) => {
    const label = setting.find((item) => item.key === key);
    if (label) {
      return label.label;
    }
    return key;
  }

  const getSettingValue = (key) => {
    const value = setting.find((item) => item.key === key);
    if (value) {
      return value.value;
    }
    return '';
  }
  const handleSaveSettings = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });
    try {
      await router.post(window.route("settings.update"), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
    setNewLogo(null)
  };

  const validationSchema = Yup.object({
    instancename: Yup.string().required('Name is required'),
    instancelogo: Yup.mixed(),
    domainname: Yup.string(),
    phonenumber: Yup.string(),
    email: Yup.string().email('Invalid email'),
    address: Yup.string(),
    announcement: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      instancename: '',
      instancelogo: null,
      domainname: '',
      phonenumber: '',
      email: '',
      address: '',
      announcement: '',
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleSaveSettings(values);
    },
  });

  useEffect(() => {
    formik.setValues({
      instancename: getSettingValue('instancename'),
      instancelogo: getSettingValue('instancelogo'),
      domainname: getSettingValue('domainname'),
      phonenumber: getSettingValue('phonenumber'),
      email: getSettingValue('email'),
      address: getSettingValue('address'),
      announcement: getSettingValue('announcement'),
    });
    setCurrentLogo(getSettingValue('instancelogo'));
  }, [setting]);


  const handleFileChange = (event) => {
    formik.setFieldValue('instancelogo', event.currentTarget.files[0]);
    setNewLogo(URL.createObjectURL(event.currentTarget.files[0]));
  };

  return (
    <>
      <Head>
        <title>Settings</title>
        <meta name="description" content="Settings Page" />
      </Head>
      <Grid sx={{my: 2}} container direction="row" justifyContent="space-between" spacing={2}  alignItems="flex-start">
        <Grid item xs={12} md={8} justifyContent="flex-start" >
          <MainCard>
            <form onSubmit={formik.handleSubmit}>
              <TextField
                label={getSettingLabel('instancename')}
                fullWidth
                margin="normal"
                {...formik.getFieldProps('instancename')}
                error={formik.touched.instancename && Boolean(formik.errors.instancename)}
                helperText={formik.touched.instancename && formik.errors.instancename}
              />
              <Grid container justifyContent="center" spacing={2} alignItems="center">
                <Grid item alignItems="center" justifyContent="center"  xs={6}>
                  <img src={currentLogo} alt="Current Logo" style={{maxHeight: 200, maxWidth: '100%'}}/>
                  <Typography variant="caption">Current Logo</Typography>
                </Grid>
                <Grid item alignItems="center" justifyContent="center"  xs={6}>
                  {newLogo && (
                    <>
                    <img src={newLogo} alt="New Logo" style={{maxHeight: 200, maxWidth: '100%'}}/>
                    <Typography variant="caption">New Logo</Typography>
                    </>
                  )}
                </Grid>
              </Grid>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon/>}
              >
                Upload File
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{display: 'none'}}
                  accept="image/*"
                />
              </Button>
              {formik.errors.instancelogo && <div style={{color: 'red'}}>{formik.errors.instancelogo}</div>}

              <TextField
                label={getSettingLabel('domainname')}
                fullWidth
                margin="normal"
                {...formik.getFieldProps('domainname')}
                error={formik.touched.domainname && Boolean(formik.errors.domainname)}
                helperText={formik.touched.domainname && formik.errors.domainname}
              />
              <TextField
                label={getSettingLabel('phonenumber')}
                fullWidth
                margin="normal"
                {...formik.getFieldProps('phonenumber')}
                error={formik.touched.phonenumber && Boolean(formik.errors.phonenumber)}
                helperText={formik.touched.phonenumber && formik.errors.phonenumber}
              />
              <TextField
                label={getSettingLabel('email')}
                fullWidth
                type="email"
                margin="normal"
                {...formik.getFieldProps('email')}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                label={getSettingLabel('address')}
                fullWidth
                margin="normal"
                {...formik.getFieldProps('address')}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
              <TextField
                label={`${getSettingLabel('announcement')} - (MD supported)}`}
                fullWidth
                multiline
                rows={10}
                margin="normal"
                {...formik.getFieldProps('announcement')}
                error={formik.touched.announcement && Boolean(formik.errors.announcement)}
                helperText={formik.touched.announcement && formik.errors.announcement}
              />
              <DialogActions>
                <Button type="submit" color="primary" variant="contained">Save Settings</Button>
              </DialogActions>
            </form>
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

SettingsPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default SettingsPage;
