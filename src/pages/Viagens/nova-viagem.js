import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Modal, Button, TextField, Select, MenuItem, InputLabel } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import FileUploader from "../../components/fileReader";

export default function NovaViagem() {
    const [openModalCte, setopenModalCte] = useState(false);
    const [ctes, setCtes] = useState([]);

    const handleCloseAddCtes = () => {
        setopenModalCte(false);
    }


    const handleAddCtes = () => {
        console.log(ctes)
        setopenModalCte(true);
    };


    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="md">
                <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
                    Nova viagem
                </Typography>
                <Button align="center" variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={handleAddCtes}>
                    Adicionar CTES
                </Button>
                <Modal open={openModalCte} onClose={handleCloseAddCtes}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        <FileUploader ctes={ctes} setCtes={setCtes} setClose={setopenModalCte} />
                    </div>
                </Modal>
            </ContainerBig>
        </>
    )
}

const ContainerBig = styled.div`
    margin-top: 100px;
    margin-left: 100px;
    margin-right: 100px;
`
