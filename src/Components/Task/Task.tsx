import React, { FC, ReactElement } from 'react';

import { Box } from '@mui/material';
import { TaskHeader } from './_TaskHeader';
import { TaskDescription } from './_TaskDescription';
import { TaskFooter } from './_TaskFooter';
import { ITask } from './interfaces/ITask';
import { Status } from '../createTaskForm/enums/status';
import { Priority } from '../createTaskForm/enums/priority';
import PropTypes from 'prop-types';
import { renderPriorityBorderColor } from './helpers/renderPriorityBorderColor';

export const Task: FC<ITask> = (props): ReactElement => {
  //Desctructure props
  const {
    title = 'Test title',
    date = new Date(),
    description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci placeat, odit perspiciatis modi omnis saepe, cumque unde impedit facilis recusandae nisi consequatur, eum libero corrupti quisquam nam labore soluta optio?',
    priority = Priority.normal,
    status = Status.completed,
    onStatusChange = (e) => console.log(e),
    onClick = (e) => console.log(e),
    id,
  } = props;
  return (
    <Box
      display={'flex'}
      width={'100%'}
      justifyContent={'flex-start'}
      flexDirection={'column'}
      mb={4}
      p={2}
      sx={{
        width: '100%',
        backgroundColor: 'background.paper',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: renderPriorityBorderColor(priority),
      }}
    >
      <TaskHeader title={title} date={date}></TaskHeader>
      <TaskDescription description={description}></TaskDescription>
      <TaskFooter
        id={id}
        status={status}
        onClick={onClick}
        onStatusChange={onStatusChange}
      ></TaskFooter>
    </Box>
  );
};

Task.propTypes = {
  title: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  description: PropTypes.string,
  onStatusChange: PropTypes.func,
  onClick: PropTypes.func,
  priority: PropTypes.string,
  status: PropTypes.string,
};
