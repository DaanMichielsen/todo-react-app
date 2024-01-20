import React, { FC, ReactElement, useContext, useEffect } from 'react';
import { Grid, Box, Alert, LinearProgress } from '@mui/material';
import { format } from 'date-fns';
import { TaskCounter } from './taskCounter/taskCounter';
import { Task } from '../Task/Task';
import PropTypes from 'prop-types';
import { TaskHeader } from '../Task/_TaskHeader';
import { useQuery, useMutation } from '@tanstack/react-query';
import { sendApiRequest } from '../../helpers/sendApiRequest';
import { ITaskApi } from './interfaces/ITaskApi';
import { Status } from '../createTaskForm/enums/status';
import { IUpdateTask } from '../createTaskForm/interfaces/IUpdateTask';
import { countTasks } from './helpers/countTasks';
import { TaskStatusChangedContext } from '../../context';

export const TaskArea: FC = (): ReactElement => {
  const taskUpdateContext = useContext(TaskStatusChangedContext);

  const { error, isLoading, data, refetch } = useQuery<ITaskApi[], Error>({
    queryKey: ['tasks'], // Pass the query key as an array
    queryFn: async () => {
      return await sendApiRequest<ITaskApi[]>(
        'http://localhost:3200/tasks',
        'GET',
      );
    },
  });

  // update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: (data: IUpdateTask) =>
      sendApiRequest('http://localhost:3200/tasks', 'PUT', data),
  });

  useEffect(() => {
    refetch();
  }, [taskUpdateContext.updated]);

  useEffect(() => {
    if (updateTaskMutation.isSuccess) {
      taskUpdateContext.toggle();
    }
  }, [updateTaskMutation.isSuccess]);

  function onStatusChangeHandler(
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
  ) {
    updateTaskMutation.mutate({
      id,
      status: e.target.checked ? Status.inProgress : Status.todo,
    });
  }

  function markCompleteHandler(
    e:
      | React.MouseEvent<HTMLButtonElement>
      | React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) {
    updateTaskMutation.mutate({
      id,
      status: Status.completed,
    });
  }

  return (
    <Grid item md={8} px={4}>
      <Box mb={8} px={4}>
        <h2>Status Of Your Tasks As Of {format(new Date(), 'PPPP')}</h2>
      </Box>
      <Grid container display="flex" justifyContent="center">
        <Grid
          item
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-around'}
          alignItems={'center'}
          md={10}
          xs={12}
          mb={8}
        >
          <TaskCounter
            status={Status.todo}
            count={data ? countTasks(data, Status.todo) : undefined}
          ></TaskCounter>
          <TaskCounter
            status={Status.inProgress}
            count={data ? countTasks(data, Status.inProgress) : undefined}
          ></TaskCounter>
          <TaskCounter
            status={Status.completed}
            count={data ? countTasks(data, Status.completed) : undefined}
          ></TaskCounter>
        </Grid>
        <Grid item display={'flex'} flexDirection={'column'} xs={10} md={8}>
          <>
            {error && (
              <Alert severity="error">
                There was an error fetching your tasks
              </Alert>
            )}
            {!error && Array.isArray(data) && data.length === 0 && (
              <Alert severity="warning">
                You do not have any tasks created yet. Start by creating some
                tasks
              </Alert>
            )}
            {isLoading ? (
              <LinearProgress />
            ) : (
              Array.isArray(data) &&
              data.length > 0 &&
              data.map((each, index) => {
                return each.status === Status.todo ||
                  each.status === Status.inProgress ? (
                  <Task
                    key={index + each.priority}
                    id={each.id}
                    title={each.title}
                    date={new Date(each.date)}
                    description={each.description}
                    priority={each.priority}
                    status={each.status}
                    onStatusChange={onStatusChangeHandler}
                    onClick={markCompleteHandler}
                  />
                ) : (
                  false
                );
              })
            )}
          </>
        </Grid>
      </Grid>
    </Grid>
  );
};

TaskHeader.propTypes = {
  title: PropTypes.string,
  date: PropTypes.instanceOf(Date),
};
