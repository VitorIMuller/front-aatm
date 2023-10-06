    import * as React from 'react';
    import { styled, useTheme } from '@mui/material/styles';
    import MuiDrawer from '@mui/material/Drawer';
    import MuiAppBar from '@mui/material/AppBar';
    import Toolbar from '@mui/material/Toolbar';
    import List from '@mui/material/List';
    import Typography from '@mui/material/Typography';
    import IconButton from '@mui/material/IconButton';
    import MenuIcon from '@mui/icons-material/Menu';
    import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
    import ChevronRightIcon from '@mui/icons-material/ChevronRight';
    import ListItem from '@mui/material/ListItem';
    import ListItemButton from '@mui/material/ListItemButton';
    import ListItemIcon from '@mui/material/ListItemIcon';
    import ListItemText from '@mui/material/ListItemText';
    import PeopleIcon from '@mui/icons-material/People';
    import LocalShippingIcon from '@mui/icons-material/LocalShipping';
    import MovingIcon from '@mui/icons-material/Moving';
    import DashboardIcon from '@mui/icons-material/Dashboard';
    import { Link } from 'react-router-dom';
    import BusinessIcon from '@mui/icons-material/Business';
import { Tooltip } from '@mui/material';

    const drawerWidth = 240;

    const openedMixin = (theme) => ({
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
    });

    const closedMixin = (theme) => ({
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up('sm')]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
        },
    });

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
        ({ theme, open }) => ({
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            ...(open && {
                ...openedMixin(theme),
                '& .MuiDrawer-paper': openedMixin(theme),
            }),
            ...(!open && {
                ...closedMixin(theme),
                '& .MuiDrawer-paper': closedMixin(theme),
            }),
        }),
    );


    export const Sidebar= ({ children }) => {
        const theme = useTheme();
        const [open, setOpen] = React.useState(false);

        const handleDrawerOpen = () => {
            setOpen(true);
        };

        const handleDrawerClose = () => {
            setOpen(false);
        };

        const items = [
            {
                text: 'Relatórios',
                icon: <DashboardIcon />,
                link: '/'
            },
            {
                text: 'Frota',
                icon: <LocalShippingIcon />,
                link: '/frota'
            },
            {
                text: 'Clientes',
                icon: <BusinessIcon />,
                link: '/clientes'
            },
            {
                text: 'Viagens',
                icon: <MovingIcon />,
                link: '/viagens'
            },
            {
                text: 'Motoristas',
                icon: <PeopleIcon />,
                link: '/motoristas'
            }
        ]
            
        
        return (
            <>
                <AppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(open && { display: 'none' }),
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div">
                            AATM - Transportes
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader color="inherit">
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <List style={{fontWeight: 'bold'}}>
                        {items.map((item, index) => (
                            <Redirect to={{
                                pathname: `${item.link}`
                            }}>
                                <Tooltip
                                    key={item.text}
                                    title={item.text} 
                                    placement="right" 
                                    arrow
                                    disableHoverListener={open} 
                                >

                                <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                        >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: open ? 3 : 'auto',
                                                justifyContent: 'center',
                                            }}
                                            >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                                    </ListItemButton>
                                </ListItem>
                                            </Tooltip>
                            </Redirect>
                        ))}
                    </List>
                </Drawer>
            </>
        );
    };

    const Redirect = styled(Link)`
        all: unset
    `;