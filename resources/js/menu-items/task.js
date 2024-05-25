// assets
import {IconSubtask,IconScriptPlus,IconList} from '@tabler/icons-react';

// constant
const icons = {
  IconSubtask,IconScriptPlus,IconList
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const categories = {
  id: 'task-group',
  title: 'Task',
  permission: [
    'tasks.add',
    'tasks.index',
    'tasks.all.index'
  ],
  type: 'group',
  children: [
    {
      id: 'tasks',
      title: 'Add Task',
      type: 'item',
      permission: ['tasks.add'],
      url: window.route('tasks.add'),
      icon: icons.IconScriptPlus,
      breadcrumbs: true
    },
    {
      id: 'list-tasks',
      title: 'Personal Task Lists',
      type: 'item',
      permission: ['tasks.index'],
      url: window.route('tasks.index'),
      icon: icons.IconSubtask,
      breadcrumbs: true
    },
    {
      id: 'list-all-tasks',
      title: 'All Task Lists',
      type: 'item',
      permission: ['tasks.all.index'],
      url: window.route('tasks.all.index'),
      icon: icons.IconList,
      breadcrumbs: true
    },
  ]
};

export default categories;
