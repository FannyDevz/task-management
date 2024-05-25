import React, {useEffect, useState} from "react";
import MainCard from "@/ui-component/cards/MainCard.jsx";
import Typography from "@mui/material/Typography";
import MainLayout from "@/layout/MainLayout";
import {Head} from "@inertiajs/react";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Grid from "@mui/material/Grid";
import EarningCard from "@/pages/Dashboard/EarningCard.jsx";
import TotalOrderLineChartCard from "@/pages/Dashboard/TotalOrderLineChartCard.jsx";
import TotalIncomeDarkCard from "@/pages/Dashboard/TotalIncomeDarkCard.jsx";
import TotalIncomeLightCard from "@/pages/Dashboard/TotalIncomeLightCard.jsx";
import StorefrontTwoToneIcon from '@mui/icons-material/StorefrontTwoTone';
import TotalGrowthBarChart from "@/pages/Dashboard/TotalGrowthBarChart.jsx";
import PopularCard from "@/pages/Dashboard/PopularCard.jsx";

import { gridSpacing } from '@/store/constant';
import AnnouncementCard from "@/pages/Dashboard/Announcement.jsx";
const Home = ({settings}) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

    return (
        <>
            <Head>
                <title>Home</title>
                <meta name="description" content="Your page description" />
            </Head>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <EarningCard isLoading={isLoading} />
                </Grid>
                <Grid item lg={4} md={6} sm={6} xs={12}>
                  <TotalOrderLineChartCard isLoading={isLoading} />
                </Grid>
                <Grid item lg={4} md={12} sm={12} xs={12}>
                  <Grid container spacing={gridSpacing}>
                    <Grid item sm={6} xs={12} md={6} lg={12}>
                      <TotalIncomeDarkCard isLoading={isLoading} />
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} lg={12}>
                      <TotalIncomeLightCard
                        {...{
                          isLoading: isLoading,
                          total: 203,
                          label: 'Total Income',
                          icon: <StorefrontTwoToneIcon fontSize="inherit" />
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={gridSpacing}>
                <Grid item xs={12} md={8}>
                  <AnnouncementCard settings={settings}/>
                </Grid>
                <Grid item xs={12} md={4}>
                  {/*<PopularCard isLoading={isLoading} />*/}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
    )
}
Home.layout = (page) => (
    <MainLayout>{page}</MainLayout>
);

export default Home
