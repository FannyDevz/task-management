import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

// project imports
import NavItem from '../NavItem';
import NavCollapse from '../NavCollapse';
import menuItem from "@/menu-items/index.js";

// ==============================|| SIDEBAR MENU LIST GROUP ||============================== //

const NavGroup = ({ item , userData, userPermissions}) => {

  const theme = useTheme();
  // menu list collapse & items
  const items = item.children?.map((menu) => {
    switch (menu.type) {
      case 'collapse':
        if (!menu.permission){
          return <NavCollapse key={menu.id} menu={menu} level={1} userData={userData} userPermissions={userPermissions}/>;
        } else {
          if (userData.role.slug === 'admin' ){
            return <NavCollapse key={menu.id} menu={menu} level={1}  userData={userData} userPermissions={userPermissions}/>;
          } else {
            if (menu.permission.some(element => userPermissions.includes(element))) {
              return <NavCollapse key={menu.id} menu={menu} level={1} userData={userData} userPermissions={userPermissions} />;
            }
            else {
              return null;
            }
          }
        }
      case 'item':
        if (!menu.permission){
          return <NavItem key={menu.id} item={menu} level={1} />;
        } else {
          if (userData.role.slug === 'admin' ){
            return <NavItem key={menu.id} item={menu} level={1} />;
          } else {
            if (menu.permission.some(element => userPermissions.includes(element))) {
              return <NavItem key={menu.id} item={menu} level={1} />;
            }
            else {
              return null;
            }
          }
        }
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography variant="caption" sx={{ ...theme.typography.menuCaption }} display="block" gutterBottom>
              {item.title}
              {item.caption && (
                <Typography variant="caption" sx={{ ...theme.typography.subMenuCaption }} display="block" gutterBottom>
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>

      {/* group divider */}
      <Divider sx={{ mt: 0.25, mb: 1.25 }} />
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object
};

export default NavGroup;
