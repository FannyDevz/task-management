// assets
import { IconUsers, IconManualGearbox,IconSettings,IconGoGame,IconCategory} from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconManualGearbox,IconGoGame,
  IconSettings,IconCategory
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const categories = {
  id: 'config-categories',
  title: 'Configs Categories',
  permission: [
    'categories.index',
    'config.field.index',
    'config.option.index'
  ],
  type: 'group',
  children: [
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      permission: ['categories.index'],
      url: window.route('categories.index'),
      icon: icons.IconCategory,
      breadcrumbs: true
    },
  ]
};

export default categories;
