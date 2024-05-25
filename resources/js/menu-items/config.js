// assets
import { IconUsers, IconManualGearbox,IconCirclesRelation,IconSettings,IconVersions,IconCategory} from '@tabler/icons-react';

// constant
const icons = {
  IconUsers,
  IconManualGearbox,IconVersions,
  IconCirclesRelation,IconCategory,IconSettings
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const configs = {
  id: 'configs-settings',
  title: 'Configs ',
  permission: [
    'users.index',
    'roles.index',
    'permissions.index',
    'settings.index'
  ],
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      permission: ['users.index'],
      url: window.route('users.index'),
      icon: icons.IconUsers,
      breadcrumbs: true
    },

    {
      id: 'roles-permissions',
      title: 'Roles & Permissions',
      permission: [
        'roles.index',
        'permissions.index'
      ],
      type: 'collapse',
      icon: icons.IconManualGearbox,
      children: [
        {
          id: 'roles',
          title: 'Roles',
          type: 'item',
          permission: ['roles.index'],
          url: window.route('roles.index'),
          breadcrumbs: true,
        },
        {
          id: 'permissions',
          title: 'Permissions',
          type: 'item',
          permission: ['permissions.index'],
          url: window.route('permissions.index'),
          breadcrumbs: true,
        },
      ]
    },
    {
      id: 'settings',
      title: 'Settings',
      type: 'item',
      permission: ['settings.index'],
      url: window.route('settings.index'),
      icon: icons.IconSettings,
      breadcrumbs: true
    },
  ]
};

export default configs;
