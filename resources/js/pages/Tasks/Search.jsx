import React, {useEffect, useRef, useState} from "react";
import { Head,Link, router, usePage } from "@inertiajs/react";
import Grid from "@mui/material/Grid";
import {useFormik} from "formik";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import {Accordion, AccordionDetails, AccordionSummary, MenuItem, Select} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as PropTypes from "prop-types";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {IconFilter} from "@tabler/icons-react";
import InputLabel from "@mui/material/InputLabel";
const Search = ({options, url, search, sort, order,limit , status, user_auth,  user_permissions }) => {
  const filter = options.filter ?? '';
  const formik = useFormik({
    initialValues: {
      username:filter.username ?? '',
      subject: filter.subject ?? '',
      description: filter.description ?? '',
      category: filter.category ?? '',
      point:filter.point ?? '',
      extrapoint:filter.extrapoint ?? '',
      status:filter.status ?? '',
    },
    onSubmit: (values) => {
      handleFilter(values);
    },
  });


  const handleFilter = (filter) => {
    router.get(url, { search, sort, order,limit, page: 1, filter });
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        {/*<IconFilter/>*/}
        <Typography variant="h4" >Filter</Typography>
      </AccordionSummary>
      <AccordionDetails>
          <form onSubmit={formik.handleSubmit}>
            <Grid container justifyContent="space-between" spacing={2} alignItems="flex-start">
              <Grid item xs={12} md={6} justifyContent="center">

                {(window.route('tasks.all.index') === url) && (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  size="small"
                  name="username"
                  defaultValue={formik.values.username}
                  onChange={formik.handleChange}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
                  )}
                <TextField
                  fullWidth
                  margin="normal"
                  size="small"
                  name="subject"
                  label="Subject"
                  defaultValue={formik.values.subject}
                  onChange={formik.handleChange}
                  error={formik.touched.subject && Boolean(formik.errors.subject)}
                  helperText={formik.touched.subject && formik.errors.subject}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  size="small"
                  name="description"
                  defaultValue={formik.values.description}
                  multiline
                  rows={4}
                  onChange={formik.handleChange}
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12} md={6} justifyContent="center">
                <TextField
                  fullWidth
                  label="Category"
                  name="category"
                  size="small"
                  defaultValue={formik.values.category}
                  margin="normal"
                  onChange={formik.handleChange}
                  error={formik.touched.category && Boolean(formik.errors.category)}
                  helperText={formik.touched.category && formik.errors.category}
                />
                {(window.route('tasks.all.index') === url) && (
                <TextField
                  fullWidth
                  label="Point"
                  margin="normal"
                  size="small"
                  defaultValue={formik.values.point}
                  type="number"
                  name="point"
                  onChange={formik.handleChange}
                  error={formik.touched.point && Boolean(formik.errors.point)}
                  helperText={formik.touched.point && formik.errors.point}
                />
                )}

                {(window.route('tasks.all.index') === url) && (
                <TextField
                  fullWidth
                  label="Extra Point"
                  type="number"
                  margin="normal"
                  size="small"
                  name="extrapoint"
                  defaultValue={formik.values.extrapoint}
                  onChange={formik.handleChange}
                  error={formik.touched.extrapoint && Boolean(formik.errors.extrapoint)}
                  helperText={formik.touched.extrapoint && formik.errors.extrapoint}
                />
                )}
                <FormControl fullWidth
                             size={"small"} margin={'normal'}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    size={"small"}
                    value={formik.values.status}
                    onChange={formik.handleChange}
                    name="status"
                    error={formik.touched.status && Boolean(formik.errors.status)}
                  >
                    {status.map((status, index) => (
                      <MenuItem key={index} value={status.name}>
                        {status.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {formik.touched.status && formik.errors.status && (
                    <div style={{ color: 'red', fontSize: '12px' }}>{formik.errors.status}</div>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} justifyContent="center">
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{ mt: 1 }}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
      </AccordionDetails>
    </Accordion>
)}

export default Search