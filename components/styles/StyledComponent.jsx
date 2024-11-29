import { messageTypingInputBackgroundColor } from "@/constants/color";
import { styled } from "@mui/material";


export const VisuallyHiddenInput = styled("input")({
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
});

export const InputBox = styled("input")({
    width: '100%',
    height: '100%',
    // border: '2px red white',
    border: 'none',
    outline: 'none',
    padding: '0 3rem',
    borderRadius: '2rem',
    backgroundColor: messageTypingInputBackgroundColor,
})

export const SearchField = styled("input")({
    width: '20vmax',
    padding: '1rem 2rem',
    border: 'none',
    outline: 'none',
    borderRadius: "1.5rem",
    backgroundColor: "#f1f1f1",
    fontsize: '1.1rem'
})

export const CurveButton = styled('button')({
    width: 'auto',
    height: 'auto',
    padding: '0.5rem 1rem',
    border: 'none',
    outline: 'none',
    borderRadius: '1.5rem',
    backgroundColor: 'rgba(0,0,0,0.9)',
    fontSize: '1.1rem',
    cursor: 'pointer',
    "&:hover":{
        backgroundColor: 'rgba(0,0,0,0.7)'
    },
    color:'white'
})