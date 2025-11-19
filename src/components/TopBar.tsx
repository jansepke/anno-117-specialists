import GitHubIcon from "@mui/icons-material/GitHub";
import HomeIcon from "@mui/icons-material/Home";
import { Link } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { languages } from "../anno-config";

const TopBar: React.FC = () => {
  const { i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLangChange = (lng: string) => () => {
    i18n.changeLanguage(lng);
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Link href="/">
          <IconButton color="inherit" size="large">
            <HomeIcon />
          </IconButton>
        </Link>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Anno 117 Specialists
        </Typography>
        <div>
          <Button color="inherit" onClick={handleMenu}>
            {i18n.language}
          </Button>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
            keepMounted
            open={open}
            onClose={handleLangChange}
          >
            {languages.map((lng) => (
              <MenuItem key={lng.key} disabled={lng.key === i18n.language} onClick={handleLangChange(lng.key)}>
                <Typography variant="button" display="block">
                  {lng.key}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </div>
        <Box display={{ xs: "none", sm: "block" }}>
          <Chip label="Anno Version 18.2" color="primary" />
          <IconButton
            color="inherit"
            href="https://github.com/jansepke/anno-toolkit"
            target="_blank"
            rel="noopener"
            size="large"
          >
            <GitHubIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
