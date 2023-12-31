import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Modal,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Card
} from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as api from "./../../Services/api";
import Swal from "sweetalert2";
import { MagnifyingGlass } from "react-loader-spinner";

export default function Frota() {

    const [caminhoes, setCaminhoes] = useState([]);
    const [openModalNovoCaminhao, setModalNovoCaminhao] = useState(false);
    const [openModalEditCaminhao, setOpenModalEditCaminhao] = useState(false);
    const [openModalDeleteCaminhao, setopenModalDeleteCaminhao] = useState(false);
    const [selectedCaminhao, setSelectedCaminhao] = useState(null);
    const [novoCaminhao, setNovoCaminhao] = useState({});
    const [loading, setLoading] = useState(false);
    const [motoristas, setMotoristas] = useState([]);
    const [layoutLoading, setLayoutLoading] = useState(false);

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


    function createCaminhao(e) {
        e.preventDefault()

        setLoading(true)
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

    function getCaminhoes() {
        setLayoutLoading(true)
        api.listarcaminhoes().then((response) => {
            setCaminhoes(response.data)
            setLayoutLoading(false)
        })
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
                                Listagem de caminhoes
                            </Typography>
                            <Button align="center" variant="contained" color="primary" onClick={handlenovoCaminhao} style={{ marginBottom: '20px' }}>
                                Novo caminhão
                            </Button>
                            <Card align="center">
                                <TableContainer align="center">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ width: '10%' }}>ID</TableCell>
                                                <TableCell style={{ width: '50%' }}>Placa</TableCell>
                                                <TableCell style={{ width: '30%' }}>Motorista</TableCell>
                                                <TableCell style={{ width: '10%' }}>Opções</TableCell>
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
                            </Card>
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
                                    <Typography variant="h6" gutterBottom>
                                        Cadastrar Novo Caminhão
                                    </Typography>
                                    <TextField
                                        label="Placa"
                                        value={novoCaminhao.placa}
                                        onChange={(e) => setNovoCaminhao({ ...novoCaminhao, placa: e.target.value })}
                                        fullWidth
                                        margin="normal"
                                        required
                                    />
                                    <InputLabel id="demo-simple-select-label">Motorista</InputLabel>
                                    <Select
                                        label="Motorista"
                                        value={setNovoCaminhao.motorista}
                                        onChange={(e) => setNovoCaminhao({ ...novoCaminhao, motorista_id: e.target.value })}
                                        fullWidth
                                        required
                                        style={{ marginBottom: '10px' }}
                                    >
                                        {motoristas.map((motorista) => (
                                            <MenuItem key={motorista._id} value={motorista._id}>
                                                {motorista.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <Button variant="outlined" color="primary" onClick={handleModalNovoCaminhao} style={{ marginRight: '10px' }}>
                                        Cancelar
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={createCaminhao} loading>
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
