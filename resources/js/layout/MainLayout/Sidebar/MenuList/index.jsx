// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import menuItem from '@/menu-items';
import NavCollapse from "@/layout/MainLayout/Sidebar/MenuList/NavCollapse/index.jsx";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = ({userData, userPermissions}) => {
  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        if (!item.permission){
          return <NavGroup key={item.id} item={item} userData={userData} userPermissions={userPermissions}/>;
        } else {
          if (userData.role.slug === 'admin' ){
            return <NavGroup key={item.id} item={item} userData={userData} userPermissions={userPermissions}/>;
          } else {
            if (item.permission.some(element => userPermissions.includes(element))) {
              return <NavGroup key={item.id} item={item} userData={userData} userPermissions={userPermissions} />;
            }
            else {
              return null;
            }
          }
        }
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
