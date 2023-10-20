import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Modal, Button, TextField } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as api from "./../../Services/api"
import Swal from "sweetalert2";
import { MagnifyingGlass } from "react-loader-spinner";

export default function Motorsitas() {

    const [motoristas, setMotoristas] = useState([]);
    const [openModalNovoMotorista, setOpenModalNovoMotorista] = useState(false);
    const [openModalEditMotorista, setOpenModalEditMotorista] = useState(false);
    const [openModalDeleteMotorista, setOpenModalDeleteMotorista] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [novoMotorista, setNovoMotorista] = useState({});
    const [loading, setLoading] = useState(false);
    const [layoutLoading, setLayoutLoading] = useState(false);
    
    const handleNovoMotorista = () => {
        setOpenModalNovoMotorista(true);
    };

    const handleModalCloseNovoMotorista = () => {
        setNovoMotorista({});
        setOpenModalNovoMotorista(false);
    }
    
    const handleEditClick = (client) => {
        setSelectedClient(client);
        setOpenModalEditMotorista(true);
    };

    const handleModalCloseEditMotorista = () => {
        setSelectedClient({});
        setOpenModalEditMotorista(false);
    }

    const handleDeleteClick = (client) => {
        setSelectedClient(client);
        setOpenModalDeleteMotorista(true)
    };

    const handleModalCloseDeleteMotorista = () => {
        setSelectedClient({});
        setOpenModalDeleteMotorista(false);
    }

    function getMotoristas() {
        setLayoutLoading(true)
        api.listarMotoristas().then((response) => {
            setMotoristas(response.data)
            setLayoutLoading(false)
        })
    }

    function createMotorista(e) {
        e.preventDefault()

        setLoading(true)

        const formData = {
            nome: novoMotorista.nome,
            cpf: 1,
            telefone: 1,
            status: true
        }

        api.criarMotorista(formData).then((response) => {
            setMotoristas((prevData) => [...prevData, response.data.motorista])
            Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                title: `${response.data.msg}`,
                showConfirmButton: false,
                timer: 1500
            })
        }).catch((err) => {
            Swal.fire({
                position: 'bottom-end',
                icon: 'error',
                title: 'Ops! Ocorreu algum erro!',
                showConfirmButton: false,
                timer: 1500
            })
        })
        setLoading(false)
        setNovoMotorista({});
        handleModalCloseNovoMotorista();
    }

    function editMotorista(e) {
        e.preventDefault()

        setLoading(true)

        const formData = {
            id: selectedClient._id,
            nome: selectedClient.nome,
            cpf: 1,
            telefone: 1,
            status: true
        }

        api.editarMotorista(formData).then((response) => {
            const newData = [...motoristas]
            const index = motoristas.findIndex(m => m._id === response.data.motorista._id)

            newData[index] = response.data.motorista;

            setMotoristas(newData)
            Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                title: `${response.data.msg}`,
                showConfirmButton: false,
                timer: 1500
            })
        }).catch((err) => {
            Swal.fire({
                position: 'bottom-end',
                icon: 'error',
                title: 'Ops! Ocorreu algum erro!',
                showConfirmButton: false,
                timer: 1500
            })
        })
        setLoading(false)
        setSelectedClient({});
        setOpenModalEditMotorista(false);
    }

    function excluirMotorista(e) {
        e.preventDefault()

        setLoading(true)
        api.excluirMotorista(selectedClient._id).then((response) => {
            const newData = [...motoristas]
            const index = motoristas.findIndex(m => m._id === selectedClient._id)

            newData.splice(index, 1);

            setMotoristas(newData)
            Swal.fire({
                position: 'bottom-end',
                icon: 'success',
                title: `${response.data.msg}`,
                showConfirmButton: false,
                timer: 1500
            })
        }).catch((err) => {
            Swal.fire({
                position: 'bottom-end',
                icon: 'error',
                title: 'Ops! Ocorreu algum erro!',
                showConfirmButton: false,
                timer: 1500
            })
        })
        setLoading(false)
        setSelectedClient({});
        setOpenModalDeleteMotorista(false);
    }

    useEffect(() => {
        getMotoristas()
    }, [])

    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="md">
                {
                    layoutLoading ?
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
                            <MagnifyingGlass
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="MagnifyingGlass-loading"
                                wrapperStyle={{}}
                                wrapperClass="MagnifyingGlass-wrapper"
                                glassColor='#c0efff'
                                color='#1976D2'
                            />
                        </div>
                        :
                        <>
                            <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
                                Listagem de motoristas
                            </Typography>
                            <Button align="center" variant="contained" color="primary" onClick={handleNovoMotorista} style={{ marginBottom: '20px' }}>
                                Novo motorista
                            </Button>
                            <TableContainer align="center">
                                <Table sx={{ maxWidth: 500 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>ID</TableCell>
                                            <TableCell>Motorista</TableCell>
                                            <TableCell>Situação</TableCell>
                                            <TableCell>Opções</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {motoristas.map((client, i) => (
                                            <TableRow key={i + 1}>
                                                <TableCell>{i + 1}</TableCell>
                                                <TableCell>{client.nome}</TableCell>
                                                <TableCell>{client.status === true ? 'Ativo' : 'Inativo' }</TableCell>
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
                            <Modal open={openModalDeleteMotorista} onClose={handleModalCloseDeleteMotorista}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Confirmar Exclusão
                                    </Typography>
                                    {selectedClient && (
                                        <Typography variant="body1">
                                            Tem certeza que deseja excluir o motorista {selectedClient.nome}?
                                        </Typography>
                                    )}
                                    <div style={{ display: "flex", justifyContent: 'end', marginTop: '10px' }}>
                                        <Button align="end" variant="outlined" color="primary" onClick={handleModalCloseDeleteMotorista} style={{ marginRight: '10px' }}>
                                            Cancelar
                                        </Button>
                                        <Button align="end" variant="contained" color="error" onClick={excluirMotorista}>
                                            {loading ? 'Carregando...' : 'Excluir'}
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal open={openModalEditMotorista} onClose={handleModalCloseEditMotorista}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Editar motorista
                                    </Typography>
                                    {selectedClient && (
                                        <div>
                                            <TextField
                                                label="Nome"
                                                value={selectedClient.nome}
                                                onChange={(e) => setSelectedClient({...selectedClient, nome: e.target.value})}
                                                fullWidth
                                                margin="normal"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <Button variant="outlined" color="primary" onClick={handleModalCloseEditMotorista} style={{ marginRight: '10px' }}>
                                            Cancelar
                                        </Button>
                                        <Button variant="contained" color="success" onClick={editMotorista}>
                                            {loading ? 'Carregando...' : 'Salvar'}
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal open={openModalNovoMotorista} onClose={handleModalCloseNovoMotorista}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Cadastrar Novo Motorista
                                    </Typography>
                                    <TextField
                                        label="Nome"
                                        value={novoMotorista.nome}
                                        onChange={(e) => setNovoMotorista({ ...setNovoMotorista, nome: e.target.value })}
                                        fullWidth
                                        margin="normal"
                                    />
                                    <Button variant="outlined" color="primary" onClick={handleModalCloseNovoMotorista} style={{ marginRight: '10px' }}>
                                        Cancelar
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={createMotorista} loading>
                                        {loading ? 'Carregando...' : 'Cadastrar'}
                                    </Button>
                                </div>
                            </Modal>
                        </>
                }
            </ContainerBig>
        </>
    )
}

const ContainerBig = styled.div`
    margin-top: 100px;
    margin-left: 100px;
    margin-right: 100px;
`
