import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Modal, Button, TextField, Select, MenuItem, InputLabel } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";

export default function NovaViagem() {

    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="md">
                <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
                    Nova viagem
                </Typography>
                <Button align="center" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                    Adicionar CTES
                </Button>
                
            </ContainerBig>
        </>
    )
}

const ContainerBig = styled.div`
    margin-top: 100px;
    margin-left: 100px;
    margin-right: 100px;
`
