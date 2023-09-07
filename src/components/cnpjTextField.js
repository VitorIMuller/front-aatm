import React from 'react';
import TextField from '@mui/material/TextField';
import MaskedInput from 'react-text-mask';

function CNPJMask(props) {
    const { inputRef, ...other } = props;

    return (
        <MaskedInput
            {...other}
            ref={inputRef}
            mask={[
                /\d/,
                /\d/,
                '.',
                /\d/,
                /\d/,
                /\d/,
                '.',
                /\d/,
                /\d/,
                /\d/,
                '/',
                /\d/,
                /\d/,
                /\d/,
                /\d/,
                '-',
                /\d/,
                /\d/,
            ]}
            placeholderChar={'\u2000'}
            showMask
        />
    );
}

export default function CNPJTextField(props) {
    return (
        <TextField
            {...props}
            InputProps={{
                inputComponent: CNPJMask,
            }}
        />
    );
}
