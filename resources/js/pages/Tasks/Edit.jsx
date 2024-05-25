import React, {useEffect, useRef, useState} from "react";
import { Head,Link, router, usePage } from "@inertiajs/react";

//@mui
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import { FormLabel, MenuItem, Select, styled} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
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
import FormHelperText from "@mui/material/FormHelperText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from "@mui/material/Box";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import task from "@/menu-items/task.js";

const UsersPage = ({ customforms, results, user_auth, user_permissions }) => {

  const [category , setCategory] = useState({});

  const urlPage = usePage().props.url;
  const handleCategoryChange = (id) => {
    setCategory(customforms.find((item) => item.id === id));
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  const [fileDetails, setFileDetails] = useState(null);
  const fileInputRef = useRef(null);
  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFileDetails({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(event.currentTarget.files[0]),
      });
      formik.setFieldValue('attachment', file);
    }
  };
  const handleSaveTask = async (values) => {
    try {
      await router.post(window.route('tasks.update' , results.id), values);
    } catch (error) {
      console.error("Failed to add Task :", error);
    }
  }
  const validationSchema = Yup.object({
    category_id: Yup.number().required('Category is required'),
    subject: Yup.string().required('Subject is required'),
    fields: Yup.array().required('Fields is required'),
    forms: Yup.array().required('Forms is required'),
  });

  const formik = useFormik({
    initialValues: {
      category_id: '',
      subject: '',
      description: '',
      attachment: '',
      fields:[],
      forms:[],
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values,{resetForm}) => {
      handleSaveTask(values);
    },
  });
  //
  // useEffect(() => {
  //   if (formik.values.category_id ){
  //     const selectedCustomForm = customforms.find(form => form.id === formik.values.category_id);
  //     if (selectedCustomForm) {
  //       const fieldIds = selectedCustomForm.fields.map(item => {
  //         return {
  //           configid: item.id,
  //           value: ''
  //         }
  //       });
  //       const formIds = selectedCustomForm.forms.map(item => {
  //         return {
  //           configid: item.id,
  //           value: ''
  //         }
  //       });
  //       formik.setFieldValue('fields', fieldIds);
  //       formik.setFieldValue('forms', formIds);
  //     }
  //   }
  // },[formik.values.category_id])

  useEffect(() => {
    setCategory(customforms.find((item) => item.id === results.category_id));
    formik.setFieldValue('category_id', results.category_id);
    formik.setFieldValue('subject', results.subject);
    formik.setFieldValue('description', results.description);
    const fields = results.field_values.map((item) => {
      return {
        configid: item.config_id,
        value: item.value
      }
    })
    formik.setFieldValue('fields',fields)
    const options = results.option_values.map((item) => {
      return {
        configid: item.config_id,
        value: item.option_id
      }
    })
    formik.setFieldValue('forms',options)

  }, [])
  const goBack = () => {
    window.history.back();
  };
  const handleDynamicFieldChange =  (id, value) => {
    const updatedFields = formik.values.fields.map(field => {
      if (field.configid === id) {
        return {
          ...field,
          value: value
        };
      } else {
        return field;
      }
    });
    formik.setFieldValue('fields', updatedFields);
  };


  const handleDynamicFormChange =  (id, value) => {
    const updatedForms = formik.values.forms.map(field => {
      if (field.configid === id) {
        return {
          ...field,
          value: value
        };
      } else {
        return field;
      }
    });
    formik.setFieldValue('forms', updatedForms);
  };
  return (
    <>
      <Head>
        <title>Edit Tasks</title>
        <meta name="description" content="Edit Tasks"/>
      </Head>
      <MainCard>
        <Grid mb={5} container direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={6} justifyContent="center">
            <Button variant="contained" color="secondary" onClick={ () => goBack()}>Back</Button>
          </Grid>
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <Grid container direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
            <Grid item xs={12} md={6} justifyContent="center">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    id="subject"
                    name="subject"
                    label="Subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    error={formik.touched.subject && Boolean(formik.errors.subject)}
                    helperText={formik.touched.subject && formik.errors.subject}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                      label="Category"
                      id="category_id"
                      name="category_id"
                      value={formik.values.category_id}
                      onChange={(e) => {
                        handleCategoryChange(e.target.value);
                        formik.handleChange(e);
                        formik.setFieldValue("category_id", e.target.value);
                      }}
                      error={formik.touched.category_id && Boolean(formik.errors.category_id)}
                    >
                      {customforms.map((category) => (
                        <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>{category?.info}</FormHelperText>
                    {formik.touched.category_id && formik.errors.category_id && (
                      <FormHelperText error>{formik.errors.category_id}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    sx={{mt: 1}}
                    fullWidth
                    component="label"
                    variant="contained"
                    startIcon={<CloudUploadIcon/>}
                  >
                    Upload file
                    <VisuallyHiddenInput
                      id="attachment"
                      name="attachment"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </Button>
                </Grid>

                {!fileDetails && (
                  <Grid sx={{ml:2 ,mt:2}} container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} >
                      <img src={results.attachment} alt="New Logo" style={{maxHeight: 200, maxWidth: '100%'}}/>
                      <Typography variant="body2" >Current Attachment</Typography>
                    </Grid>
                  </Grid>
                )}
                {fileDetails && (
                  <Grid sx={{ml:2 ,mt:2}} container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} >
                      <img src={fileDetails.url} alt="New Logo" style={{maxHeight: 200, maxWidth: '100%'}}/>
                    </Grid>
                    <Grid item xs={12} >
                      <Typography variant="body1"><strong>File Details:</strong></Typography>
                      <Typography variant="body2">Name: {fileDetails.name}</Typography>
                      <Typography variant="body2">Size: {(fileDetails.size / 1024).toFixed(2)} KB</Typography>
                      <Typography variant="body2">Type: {fileDetails.type}</Typography>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6} justifyContent="center">
              <Box border="1px solid" px={2} borderColor="grey.300" borderRadius="10px" py={2}>
                <Box sx={{alignItems: 'center', display: 'flex' ,mb: 2}}>
                  <Divider sx={{flexGrow: 1}} orientation="horizontal"/>
                  <Button
                    variant="outlined"
                    disableRipple
                    disabled
                  >
                    Dynamic Form
                  </Button>
                  <Divider sx={{flexGrow: 1}} orientation="horizontal"/>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
                      {customforms?.find(form => form.id === formik.values.category_id)?.fields.map((field) => (
                        <Grid key={field.id} item xs={12} md={12}>
                          <TextField
                            required={field.required === 1}
                            fullWidth
                            defaultValue={formik.values.fields?.find((f) => f.configid === field.id)?.value || ''}
                            label={field.fieldname}
                            size={"small"}
                            type={field.fieldtype}
                            InputLabelProps={{shrink: true}}
                            onChange={(e) => handleDynamicFieldChange(field.id, e.target.value)}
                            error={formik.touched.fields?.[field.id] && Boolean(formik.errors.fields?.[field.id])}
                            helperText={formik.touched.fields?.[field.id] && formik.errors.fields?.[field.id]}
                            multiline={field.fieldtype === 'textarea'}
                            rows={field.fieldtype === 'textarea' ? 4 : 1}
                          />
                          <FormHelperText> {field.detail}</FormHelperText>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
                      {customforms?.find(form => form.id === formik.values.category_id)?.forms.map((form) => (
                        <Grid item xs={12} md={12} key={form.id}>
                          {form.formtype === 'dropdown' &&
                            (
                              <FormControl fullWidth margin="normal" size="small">
                                <InputLabel>{form.formname}</InputLabel>
                                <Select
                                  label={form.formname}
                                  required={form.required === 1}
                                  defaultValue={formik.values.forms?.find((f) => f.configid === form.id)?.value || ''}
                                  fullWidth
                                  onChange={(e) => handleDynamicFormChange(form.id, e.target.value)}
                                  error={formik.touched.forms?.[form.id] && Boolean(formik.errors.forms?.[form.id])}
                                >
                                  {form.options.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                      {option.optionname}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText> {form.detail}</FormHelperText>
                              </FormControl>
                            )
                          }
                          {form.formtype === 'radio' &&
                            (
                              <FormControl fullWidth size="small">
                                <FormLabel>{form.formname}</FormLabel>
                                <RadioGroup
                                  label={form.formname}
                                  required={form.required === 1}
                                  defaultValue={formik.values.forms?.find((f) => f.configid === form.id)?.value || ''}
                                  row
                                  onChange={(e) => handleDynamicFormChange(form.id, e.target.value)}
                                  error={formik.touched.forms?.[form.id] && Boolean(formik.errors.forms?.[form.id])}
                                >
                                  {form.options.map((option) => (
                                    <FormControlLabel key={option.id} value={option.id} control={<Radio/>}
                                                      label={option.optionname}/>
                                  ))}
                                </RadioGroup>
                                {formik.touched.forms?.[form.id] && formik.errors.forms?.[form.id] && (
                                  <div style={{color: 'red', fontSize: '12px'}}>{formik.errors.forms?.[form.id]}</div>
                                )}
                              </FormControl>
                            )
                          }
                          {form.formtype === 'boolean' &&
                            (
                              <FormControl fullWidth size="small">
                                {/*<span>{formik.values.forms?.find((f) => f.configid === form.id)?.value }/{ form.options[0].id }</span>*/}
                                <FormControlLabel
                                  control={<Switch/>}
                                  label={form.formname}
                                  id={`form[${form.id}]`}
                                  checked={formik.values.forms?.find((f) => f.configid === form.id)?.value === form.options[0].id ?  true : false}
                                  name={`form[${form.id}]`}
                                  onChange={(e) => handleDynamicFormChange(form.id, e.target.checked ? form.options[0].id :  form.options[1].id )}
                                  error={formik.touched.forms?.[form.id] && Boolean(formik.errors.forms?.[form.id])}
                                />
                                <FormHelperText> {form.options[1].optionname} / {form.options[0].optionname} ({form.detail})</FormHelperText>
                              </FormControl>
                            )
                          }
                          {form.formtype === 'number-range' && (
                            <FormControl fullWidth size="small">
                              <FormLabel>{form.formname}</FormLabel>
                              <Slider
                                required={form.required === 1}
                                label={form.formname}
                                step={1}
                                defaultValue={formik.values.forms?.find((f) => f.configid === form.id)?.value || ''}
                                min={parseInt(form.options[0].optionname, 10)}
                                max={parseInt(form.options[1].optionname, 10)}
                                valueLabelDisplay="auto"
                                marks
                                onChange={(e, value) =>
                                  handleDynamicFormChange(form.id, value, form.formtype)
                                }
                                error={
                                  formik.touched.forms?.[form.id] &&
                                  Boolean(formik.errors.forms?.[form.id])
                                }
                              />
                              <FormHelperText> {form.detail}</FormHelperText>
                            </FormControl>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Button color="primary"
                      disabled={(user_auth.role.slug !== "admin" && !user_permissions.includes("tasks.change.status") && ['archived', 'accepted', 'rejected'].includes(results.status))}
                      variant="contained" fullWidth type="submit">
                Save Task
              </Button>
            </Grid>
          </Grid>
        </form>
      </MainCard>
    </>
  )
    ;
};

UsersPage.layout = (page) => (
  <MainLayout>{page}</MainLayout>
);

export default UsersPage;
