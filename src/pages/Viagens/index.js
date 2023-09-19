import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Modal, Button, TextField, Select, MenuItem, InputLabel } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as api from "./../../Services/api"
import Swal from "sweetalert2";
import FileUploader from "../../components/fileReader";
import { Link } from "react-router-dom";

export default function Viagens() {

    const [caminhoes, setCaminhoes] = useState([]);
    const [openModalNovoCaminhao, setModalNovoCaminhao] = useState(false);
    const [openModalEditCaminhao, setOpenModalEditCaminhao] = useState(false);
    const [openModalDeleteCaminhao, setopenModalDeleteCaminhao] = useState(false);
    const [selectedCaminhao, setSelectedCaminhao] = useState(null);
    const [novoCaminhao, setNovoCaminhao] = useState({});
    const [loading, setLoading] = useState(false);
    const [motoristas, setMotoristas] = useState([]);

    const handlenovoCaminhao = () => {
        setModalNovoCaminhao(true);
    };

    const handleModalNovoCaminhao = () => {
        setNovoCaminhao({});
        setModalNovoCaminhao(false);
    }

    const handleEditCaminhao = (client) => {
        setSelectedCaminhao(client);
        setOpenModalEditCaminhao(true);
    };

    const handleCloseEditarCaminhao = () => {
        setSelectedCaminhao({});
        setOpenModalEditCaminhao(false);
    }

    const handleDeleteClick = (client) => {
        setSelectedCaminhao(client);
        setopenModalDeleteCaminhao(true)
    };

    const handleCloseDeleteCaminhao = () => {
        setSelectedCaminhao({});
        setopenModalDeleteCaminhao(false);
    }

    function getCaminhoes() {
        api.listarcaminhoes().then((response) => {
            setCaminhoes(response.data)
        })
    }

    function createCaminhao(e) {
        e.preventDefault()
        console.log(novoCaminhao)

        setLoading(true)
        console.log(novoCaminhao)
        api.criarCaminhao(novoCaminhao).then((response) => {
            setCaminhoes((prevData) => [...prevData, response.data.frota])
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
        setNovoCaminhao({});
        handleModalNovoCaminhao();
    }

    function editarCaminhao(e) {
        e.preventDefault()

        setLoading(true)

        api.editarCaminhao(selectedCaminhao).then((response) => {
            const newData = [...caminhoes]
            const index = caminhoes.findIndex(m => m._id === response.data.frota._id)

            newData[index] = response.data.frota;

            setCaminhoes(newData)
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
        setSelectedCaminhao({});
        setOpenModalEditCaminhao(false);
    }

    function excluirCaminhao(e) {
        e.preventDefault()

        setLoading(true)
        api.excluirCaminhao(selectedCaminhao._id).then((response) => {
            const newData = [...caminhoes]
            const index = caminhoes.findIndex(m => m._id === selectedCaminhao._id)

            newData.splice(index, 1);

            setCaminhoes(newData)
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
        setSelectedCaminhao({});
        setopenModalDeleteCaminhao(false);
    }

    function getMotoristas() {
        api.listarMotoristas().then((response) => {
            setMotoristas(response.data)
        })
    }

    useEffect(() => {
        getCaminhoes()
        getMotoristas()
    }, [])

    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="md">
                <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
                    Listagem de viagens
                </Typography>
                <Button align="center" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                    <Redirect to="/nova-viagem">
                    Nova viagem
                    </Redirect>
                </Button>
                <TableContainer align="center">
                    <Table sx={{ maxWidth: 500 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Placa</TableCell>
                                <TableCell>Motorista</TableCell>
                                <TableCell>Opções</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {caminhoes.map((client, i) => (
                                <TableRow key={i + 1}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{client?.placa}</TableCell>
                                    <TableCell>{client.motorista ? client?.motorista[0].nome : ''}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary" onClick={() => handleEditCaminhao(client)}>
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
                <Modal open={openModalDeleteCaminhao} onClose={handleCloseDeleteCaminhao}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        <Typography variant="h6" gutterBottom>
                            Confirmar Exclusão
                        </Typography>
                        {selectedCaminhao && (
                            <Typography variant="body1">
                                Tem certeza que deseja excluir o caminhão {selectedCaminhao.placa}?
                            </Typography>
                        )}
                        <div style={{ display: "flex", justifyContent: 'end', marginTop: '10px' }}>
                            <Button align="end" variant="outlined" color="primary" onClick={handleCloseDeleteCaminhao} style={{ marginRight: '10px' }}>
                                Cancelar
                            </Button>
                            <Button align="end" variant="contained" color="error" onClick={excluirCaminhao}>
                                {loading ? 'Carregando...' : 'Excluir'}
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal open={openModalEditCaminhao} onClose={handleCloseEditarCaminhao}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        <Typography variant="h6" gutterBottom>
                            Editar motorista
                        </Typography>
                        {selectedCaminhao && (
                            <div>
                                <TextField
                                    label="placa"
                                    value={selectedCaminhao.placa}
                                    onChange={(e) => setSelectedCaminhao({ ...setSelectedCaminhao, placa: e.target.value })}
                                    fullWidth
                                    margin="normal"
                                />
                                <Select
                                    label="Selecione um motorista"
                                    value={setSelectedCaminhao.motorista}
                                    onChange={(e) => setSelectedCaminhao({ ...selectedCaminhao, motorista_id: e.target.value })}
                                    fullWidth
                                    style={{ marginBottom: '10px' }}
                                >
                                    {motoristas.map((motorista) => (
                                        <MenuItem key={motorista._id} value={motorista._id}>
                                            {motorista.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        )}
                        <div>
                            <Button variant="outlined" color="primary" onClick={handleCloseEditarCaminhao} style={{ marginRight: '10px' }}>
                                Cancelar
                            </Button>
                            <Button variant="contained" color="success" onClick={editarCaminhao}>
                                {loading ? 'Carregando...' : 'Salvar'}
                            </Button>
                        </div>
                    </div>
                </Modal>
                <Modal open={openModalNovoCaminhao} onClose={handleModalNovoCaminhao}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        <FileUploader/>
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
const Redirect = styled(Link)`
    all: unset
`;