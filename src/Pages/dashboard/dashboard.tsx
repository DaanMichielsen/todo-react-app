import React, { FC, ReactElement } from 'react';
import { Grid } from '@mui/material';
import { TaskArea } from '../../Components/taskArea/taskArea';
import { Sidebar } from '../../Components/sidebar/sidebar';
export const Dashboard: FC = (): ReactElement => {
  return (
    <Grid container minHeight="100vh" p={0} m={0}>
      <TaskArea />
      <Sidebar />
    </Grid>
  );
};
