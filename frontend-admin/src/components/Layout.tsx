import { ReactNode } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

const drawerWidth = 240;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          {[
            { text: "Home", path: "/" },
            { text: "Dashboard", path: "/dashboard" },
            { text: "Profile", path: "/profile" },
          ].map(({ text, path }) => (
            <ListItem key={text} disablePadding>
              <Link href={path} passHref legacyBehavior>
                <ListItemButton component="a">
                  <ListItemText primary={text} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px` }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
