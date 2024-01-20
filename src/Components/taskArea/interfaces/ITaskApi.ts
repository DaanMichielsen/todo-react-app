import { Priority } from '../../createTaskForm/enums/priority';
import { Status } from '../../createTaskForm/enums/status';

export interface ITaskApi {
  id: string;
  date: string;
  title: string;
  description: string;
  priority: `${Priority}`;
  status: `${Status}`;
}
