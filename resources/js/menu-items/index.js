import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import config from './config';
import task from './task';
import category from "@/menu-items/category.js";
import setting from "@/menu-items/setting.js";

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard,task,category,config]
};

export default menuItems;
