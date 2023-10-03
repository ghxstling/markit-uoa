import { createTheme } from '@mui/material/styles'

declare module '@mui/material/styles' {
    interface BreakpointOverrides {
        xs: true
        sm: true
        md: true
        lg: true
        xl: true
        xxl: true
        xxxl: true
    }
}

const CustomTheme = createTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1500,
            xxl: 1800,
            xxxl: 2100,
        },
    },
})

export type Theme = typeof CustomTheme

export default CustomTheme
