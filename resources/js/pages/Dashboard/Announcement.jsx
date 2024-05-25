import PropTypes from 'prop-types';

// material-ui
import { useTheme, styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project imports
import MainCard from '@/ui-component/cards/MainCard';
import TotalIncomeCard from '@/ui-component/cards/Skeleton/TotalIncomeCard';
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import {gridSpacing} from "@/store/constant.js";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
    borderRadius: '50%',
    top: -160,
    right: -130
  }
}));

// ==============================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||============================== //

const AnnouncementCard = ({ settings }) => {
  const theme = useTheme();
  return (
    <>
      <CardWrapper border={false} content={false}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container alignContent="center" justifyContent="space-between">
                <Grid item>
                  <List sx={{ py: 0 }}>
                    <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          sx={{
                            ...theme.typography.commonAvatar,
                            ...theme.typography.largeAvatar,
                            bgcolor: 'warning.light',
                            color: 'warning.dark'
                          }}
                        >
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        sx={{ py: 0, mt: 0.45, mb: 0.45 }}
                        primary={<Typography variant="h4">Pengumuman!!</Typography>}
                        secondary={
                          <Typography variant="subtitle2" sx={{ color: 'grey.500', mt: 0.5 }}>
                            {settings.instancename}
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Markdown remarkPlugins={[remarkGfm]} >{settings.announcement}</Markdown>
            </Grid>
          </Grid>
        </CardContent>
      </CardWrapper>
    </>
  );
};

export default AnnouncementCard;
