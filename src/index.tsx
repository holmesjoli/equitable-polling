// React dependencies
import ReactDOM from 'react-dom/client';

// Styles
import App from "./App";

// Styles
import { createTheme, ThemeProvider } from "@mui/material";
import './utils/styles/styles.scss';
import { theme } from './utils/Aesthetics';

const muiTheme = createTheme({
    typography: {
        fontFamily: "Inter, sans-serif",
        fontSize: 13
    },
    palette: {
      background: {
        paper: "#ffffff"
      },
      primary: {
        main: theme.focusColor
      },
      secondary: {
        main: theme.focusColor
      }
    },
    components: {
      MuiFormControl: {
        styleOverrides: {
          root :{
            backgroundColor: "#FFFFFF"
          }
        }
      }
    }
})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <ThemeProvider theme={muiTheme}>
            <App/>
    </ThemeProvider>
);
