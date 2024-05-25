import * as React from "react";
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from 'react-dom/client';
import reducer from './store/reducer';
import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { CssBaseline, StyledEngineProvider } from '@mui/material';
import NavigationScroll from '@/layout/NavigationScroll';
import { ThemeProvider } from '@mui/material/styles';
import themes from '@/themes';

const store = configureStore({ reducer });

const CustomizationProvider = ({ children }) => {
    const customization = useSelector((state) => state.customization);
    return (
        <ThemeProvider theme={themes(customization)}>
            {children}
        </ThemeProvider>
    );
};

void createInertiaApp({
    title: title => `${title} - Digikarir`,
    resolve: name =>
        resolvePageComponent(
            `./pages/${name}.jsx`,
            import.meta.glob("./pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        createRoot(el).render(
            <Provider store={store}>
                <StyledEngineProvider injectFirst>
                    <CustomizationProvider>
                        <CssBaseline />
                        <NavigationScroll>
                            <App {...props} />
                        </NavigationScroll>
                    </CustomizationProvider>
                </StyledEngineProvider>
            </Provider>
        );
    },
});
