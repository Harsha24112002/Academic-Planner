import { ThemeProvider } from '@emotion/react';
import { CircularProgress, Typography, createTheme } from '@mui/material';
import Box from '@mui/material/Box';
import * as React from 'react';

const topBarTheme = createTheme({
    components : {
        MuiCircularProgress : {
            styleOverrides:{
                circle: ({ ownerState }) => ({
                    ...({
                            // strokeLinecap: 'round',
                            color:  
                                ( ownerState.value < 20 && 'red' ) ||
                                ( ownerState.value < 45 && '#E65C00' ) ||
                                ( ownerState.value < 75 && 'yellow' ) ||
                                '#7ED957'
                    }) 
                }),
                root: () => ({
                    ...({
                        position: 'absolute',
                        left: 0
                    }) 
                })
            },
        },
    },
});

const bottomBarTheme = createTheme({
    components : {
        MuiCircularProgress : {
            styleOverrides : {
                root: () => ({
                    ...({
                        color: '#4D9EFF'
                    })
                })
            }
        }
    }
})

export default function CircularCreditProgressBar({ value, label1, label2 }) {
    return (
        <Box
            sx={{
                width: 100,
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                px: 3,
            }}
        >
            <Box style={{position: 'relative', display: 'inline-flex'}}>
                <ThemeProvider theme={bottomBarTheme}>
                    <CircularProgress
                        size={100}
                        thickness={5}
                        variant='determinate'
                        value={100}
                    >
                    </CircularProgress>
                </ThemeProvider>
                <ThemeProvider theme={topBarTheme}>
                    <CircularProgress 
                        size={100}
                        thickness={5}
                        variant='determinate'
                        value={value}
                    >
                    </CircularProgress>
                </ThemeProvider>
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="caption" component="div" color="text.secondary" fontSize={20} >
                        {label1}
                    </Typography>
                </Box>
            </Box>
            <Box
            >
                <Typography textAlign={'center'} fontSize={15}>
                    {label2}
                </Typography>
            </Box>
        </Box>
        
    )
};