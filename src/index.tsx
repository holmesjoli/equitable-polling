// React dependencies
import ReactDOM from 'react-dom/client';

// Styles
import App from "./App";

// Styles
import { createTheme, ThemeProvider } from "@mui/material";
import './utils/styles/styles.scss'

const theme = createTheme({
    typography: {
        fontFamily: "Inter, sans-serif",
        fontSize: 13
    },
    palette: {
      background: {
        paper: "#ffffff"
      },
      primary: {
        main: "#047391"
      },
      secondary: {
        main: "#757575"
      }
    }
})


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <ThemeProvider theme={theme}>
            <App/>
    </ThemeProvider>
);
