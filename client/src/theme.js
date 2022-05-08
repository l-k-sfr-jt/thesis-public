import {red} from '@mui/material/colors';
import {createTheme} from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    palette: {
        primary: {
            main: '#556cd6',
        },
        secondary: {
            main: '#19857b',
        },
        error: {
            main: red.A400,
        },
    },

    overrides: {
        MUIRichTextEditor: {
            root: {
                border: '1px solid rgba(0, 0, 0, 0.23)',
                borderRadius: '4px',
                '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.87)',
                },
            },
            editorContainer: {
                minHeight: '8rem',
                padding: '0 .9rem'
            },
            editor: {
                minHeight: '8rem',
                maxHeight: '20rem',
                overflowY: 'scroll',
            }
        }
    }
});

export default theme;