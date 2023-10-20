import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Modal, Button } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import DeleteIcon from '@mui/icons-material/Delete';
import * as api from "./../../Services/api"
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import moment from "moment";
import 'moment/locale/pt-br'
import { MagnifyingGlass } from "react-loader-spinner";

export default function Viagens() {

    const [viagens, setViagens] = useState([]);
    const [openModalDeleteViagem, setOpenModalDeleteViagem] = useState(false);
    const [selectedViagem, setSelectedViagem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [layoutLoading, setLayoutLoading] = useState(false)

    const handleDeleteClick = (viagem) => {
        setSelectedViagem(viagem);
        setOpenModalDeleteViagem(true)
    };

    const handleCloseDeleteViagem = () => {
        setSelectedViagem({});
        setOpenModalDeleteViagem(false);
    }

    function getviagens() {
        setLayoutLoading(true)
        api.listarViagens().then((response) => {
            setViagens(response.data)
            setLayoutLoading(false)
        })
    }

    function excluirViagem(e) {
        e.preventDefault()

        setLoading(true)
        api.excluirViagem(selectedViagem._id).then((response) => {
            const newData = [...viagens]
            const index = viagens.findIndex(m => m._id === selectedViagem._id)

            newData.splice(index, 1);

            setViagens(newData)
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
        setSelectedViagem({});
        setOpenModalDeleteViagem(false);
    }

    const formatMoney = (value) => {
        return value
            ? Number.parseFloat(value)
                .toFixed(2)
                .split('.')
                .join(',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            : '0,00'
    }

    useEffect(() => {
        getviagens()
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
                                Listagem de viagens
                            </Typography>
                            <Button align="center" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                                <Redirect to="/nova-viagem">
                                    Nova viagem
                                </Redirect>
                            </Button>
                            <TableContainer align="center">
                                <Table sx={{ maxWidth: '80%' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Data de inicio</TableCell>
                                            <TableCell>Caminhão</TableCell>
                                            <TableCell>Rota</TableCell>
                                            <TableCell>Tomador</TableCell>
                                            <TableCell>Valor</TableCell>
                                            <TableCell>Opções</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {viagens.map((viagem, i) => (
                                            <TableRow key={i + 1}>
                                                <TableCell>{moment(viagem.data_inicio).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell>{viagem.frota[0].placa}</TableCell>
                                                <TableCell>{viagem.rota}</TableCell>
                                                <TableCell>{viagem.ctes[0].tomador.nome}</TableCell>
                                                <TableCell>R$ {formatMoney(viagem.valor_total_lp)}</TableCell>
                                                <TableCell>
                                                    <IconButton color="warning" onClick={() => handleDeleteClick(viagem)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Modal open={openModalDeleteViagem} onClose={handleCloseDeleteViagem}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Confirmar Exclusão
                                    </Typography>
                                    {selectedViagem && (
                                        <Typography variant="body1">
                                            Tem certeza que deseja excluir a viagem ?
                                        </Typography>
                                    )}
                                    <div style={{ display: "flex", justifyContent: 'end', marginTop: '10px' }}>
                                        <Button align="end" variant="outlined" color="primary" onClick={handleCloseDeleteViagem} style={{ marginRight: '10px' }}>
                                            Cancelar
                                        </Button>
                                        <Button align="end" variant="contained" color="error" onClick={excluirViagem}>
                                            {loading ? 'Carregando...' : 'Excluir'}
                                        </Button>
                                    </div>
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
const Redirect = styled(Link)`
    all: unset
`;