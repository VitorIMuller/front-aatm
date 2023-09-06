import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Modal, Button, TextField } from "@mui/material";
import React, { useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Frota() {

    const [openModal, setOpenModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedEmail, setEditedEmail] = useState('');

    const handleDeleteClick = (client) => {
        setSelectedClient(client);
        setOpenModal(true);
    };
    
    const handleEditClick = (client) => {
        setSelectedClient(client);
        setEditedName(client.name);
        setEditedEmail(client.email);
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setSelectedClient(null);
    };

    const handleDeleteConfirm = () => {
        // Aqui você pode adicionar a lógica para excluir o cliente
        // Depois de excluir o cliente, feche o modal
        handleModalClose();
    };

    const handleEditConfirm = () => {
        // Aqui você pode adicionar a lógica para editar o cliente
        // Depois de editar o cliente, feche o modal
        handleModalClose();
    };

    const handleNewClientClick = () => {
        setOpenModal(true);
    };

    const clients = [
        { id: 1, name: 'MLW-2G08', motorista: 'Marco Aurélio do Amaral', situacao: 'Ativo' },
        { id: 2, name: 'QIR-0E80', motorista: 'Anderson Tabarelli', situacao: 'Ativo' },
        { id: 3, name: 'RLH-0E60', motorista: 'Sandro Tabarelli', situacao: 'Ativo' },
        // Adicione mais clientes aqui
    ];
    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="md">
                <Typography variant="h5" align="center" gutterBottom style={{fontWeight: 'bold'}}>
                    Listagem de caminhões
                </Typography>
                <Button align="center" variant="contained" color="primary" onClick={handleNewClientClick} style={{ marginBottom: '20px' }}>
                    Novo caminhão
                </Button>
                <TableContainer align="center">
                    <Table sx={{ maxWidth: 800 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Placa</TableCell>
                                <TableCell>Motorista</TableCell>
                                <TableCell>Situação</TableCell>
                                <TableCell>Opções</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.map((client) => (
                                <TableRow key={client.id}>
                                    <TableCell>{client.id}</TableCell>
                                    <TableCell>{client.name}</TableCell>
                                    <TableCell>{client.motorista}</TableCell>
                                    <TableCell>{client.situacao}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEditClick(client)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="warning" onClick={() => handleDeleteClick(client)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Modal open={openModal} onClose={handleModalClose}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        <Typography variant="h6" gutterBottom>
                            Confirmar Exclusão
                        </Typography>
                        {selectedClient && (
                            <Typography variant="body1">
                                Tem certeza que deseja excluir o caminhão {selectedClient.name}?
                            </Typography>
                        )}
                        <div style={{display: "flex", justifyContent: 'end', marginTop: '10px'}}>
                        <Button align="end" variant="outlined" color="primary" onClick={handleModalClose} style={{ marginRight: '10px' }}>
                            Cancelar
                        </Button>
                        <Button align="end" variant="contained" color="error" onClick={handleDeleteConfirm}>
                            Excluir
                        </Button>
                        </div>
                    </div>
                </Modal>
                <Modal open={openModal} onClose={handleModalClose}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        <Typography variant="h6" gutterBottom>
                            Editar Cliente
                        </Typography>
                        {selectedClient && (
                            <div>
                                <TextField
                                    label="Placa"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Motorista"
                                    value={editedEmail}
                                    onChange={(e) => setEditedEmail(e.target.value)}
                                    fullWidth
                                    margin="normal"
                                />
                            </div>
                        )}
                        <Button variant="outlined" color="primary" onClick={handleModalClose} style={{ marginRight: '10px' }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="success" onClick={handleEditConfirm}>
                            Salvar
                        </Button>
                    </div>
                </Modal>
                <Modal open={openModal} onClose={handleModalClose}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        <Typography variant="h6" gutterBottom>
                            Cadastrar Novo Cliente
                        </Typography>
                        <TextField
                            label="Placa"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button variant="outlined" color="primary" onClick={handleModalClose} style={{ marginRight: '10px' }}>
                            Cancelar
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleEditConfirm}>
                            Cadastrar
                        </Button>
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
