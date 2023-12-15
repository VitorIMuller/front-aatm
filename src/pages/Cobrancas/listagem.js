import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Modal, Button, Input, InputLabel } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import DeleteIcon from '@mui/icons-material/Delete';
import * as api from "../../Services/api"
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import moment from "moment";
import 'moment/locale/pt-br'
import { MagnifyingGlass } from "react-loader-spinner";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ptBR } from "@mui/x-date-pickers";
import { OpenInBrowser } from "@mui/icons-material";
const brLocale = ptBR.components.MuiLocalizationProvider.defaultProps.localeText;

export default function Cobrancas() {

    const [dataInicio, setDataInicio] = useState(dayjs().startOf('month'))
    const [dataFim, setDataFim] = useState(dayjs().endOf('month'))
    const [cobrancas, setCobrancas] = useState([]);
    const [openModalDeleteCobranca, setOpenModalDeleteCobranca] = useState(false);
    const [openModalDetailsCobranca, setOpenModalDetailsCobranca] = useState(false);
    const [selectedCobranca, setSelectedCobranca] = useState(null);
    const [detailsCobranca, setDetailsCobranca] = useState();
    const [loading, setLoading] = useState(false);
    const [layoutLoading, setLayoutLoading] = useState(false);

    const handleDeleteClick = (viagem) => {
        setSelectedCobranca(viagem);
        setOpenModalDeleteCobranca(true)
    };

    const handleDetaisClick = (viagem) => {
        setDetailsCobranca(viagem);
        setOpenModalDetailsCobranca(true)
    };

    const handleCloseDeleteCobranca = () => {
        setSelectedCobranca({});
        setOpenModalDeleteCobranca(false);
    }

    const handleCloseDetailsCobranca = () => {
        setOpenModalDetailsCobranca(false);
    }

    function getCobrancas() {
        setLayoutLoading(true)
        api.listarCobrancas({
            data_inicio: dayjs(dataInicio).format('YYYY-MM-DD'),
            data_fim: dayjs(dataFim).format('YYYY-MM-DD'),
        }).then((response) => {
            setCobrancas(response.data)
            setLayoutLoading(false)
        })
    }

    function excluirViagem(e) {
        e.preventDefault()

        setLoading(true)
        api.excluirViagem(selectedCobranca._id).then((response) => {
            const newData = [...cobrancas]
            const index = cobrancas.findIndex(m => m._id === selectedCobranca._id)

            newData.splice(index, 1);

            setCobrancas(newData)
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
        setSelectedCobranca({});
        setOpenModalDeleteCobranca(false);
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

    function limparFiltros(){
        setDataInicio(dayjs().startOf('month'))
        setDataFim(dayjs().endOf('month'))
    }

    function pegarCtes(viagem) {
        const arr = viagem.ctes.map(cte => cte.infos_cte.numero)
        return arr.join('-')
    }

    useEffect(() => {
        getCobrancas()
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
                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} localeText={brLocale}>
                                    <DemoContainer components={['DatePicker']}>
                                        <DatePicker
                                            slotProps={{
                                                textField: ({ position }) => ({
                                                    color: position === 'start' ? 'primary' : 'primary',
                                                }),
                                            }}
                                            label="Data início"
                                            format="DD/MM/YYYY"
                                            value={dataInicio}
                                            onChange={(newValue) => setDataInicio(newValue)} color='blue' />
                                        <DatePicker
                                            slotProps={{
                                                textField: ({ position }) => ({
                                                    color: position === 'start' ? 'primary' : 'primary',
                                                }),
                                            }}
                                            label="Data fim"
                                            format="DD/MM/YYYY"
                                            value={dataFim}
                                            onChange={(newValue) => setDataFim(newValue)}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
                                <Button align="center" variant="outlined" color="primary" onClick={limparFiltros} style={{ marginRight: '10px' }}>
                                    Limpar filtros
                                </Button>
                                <Button align="center" variant="contained" color="primary" onClick={getCobrancas}>
                                    Buscar
                                </Button>
                            </div>
                            <Button align="center" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
                                <Redirect to="/nova-viagem">
                                    Nova viagem
                                </Redirect>
                            </Button>
                            <TableContainer align="center">
                                {cobrancas?.length ?
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
                                            {cobrancas.map((viagem, i) => (
                                                <TableRow key={i + 1}>
                                                    <TableCell>{moment(viagem.data_inicio).add(1, 'day').format('DD/MM/YYYY')}</TableCell>
                                                    <TableCell>{viagem.frota[0]?.placa}</TableCell>
                                                    <TableCell>{viagem.rota}</TableCell>
                                                    <TableCell>{viagem.ctes[0]?.tomador.nome}</TableCell>
                                                    <TableCell>R$ {formatMoney(viagem.valor_total_sj)}</TableCell>
                                                    <TableCell>
                                                        <IconButton color="primary" onClick={() => handleDetaisClick(viagem)}>
                                                            <OpenInBrowser />
                                                        </IconButton>
                                                        <IconButton color="warning" onClick={() => handleDeleteClick(viagem)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    :
                                        'Ops! Não foram encontrados registros com os filtros selecionados'
                                }
                            </TableContainer>
                            <Modal open={openModalDeleteCobranca} onClose={handleCloseDeleteCobranca}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Confirmar Exclusão
                                    </Typography>
                                    {selectedCobranca && (
                                        <Typography variant="body1">
                                            Tem certeza que deseja excluir a viagem ?
                                        </Typography>
                                    )}
                                    <div style={{ display: "flex", justifyContent: 'end', marginTop: '10px' }}>
                                        <Button align="end" variant="outlined" color="primary" onClick={handleCloseDeleteCobranca} style={{ marginRight: '10px' }}>
                                            Cancelar
                                        </Button>
                                        <Button align="end" variant="contained" color="error" onClick={excluirViagem}>
                                            {loading ? 'Carregando...' : 'Excluir'}
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal open={openModalDetailsCobranca} onClose={handleCloseDetailsCobranca}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Detalhes da viagem
                                    </Typography>
                                    {detailsCobranca ? 
                                        <>
                                        <div style={{  width: '100%', marginTop: '8px' }}>
                                            <InputLabel id="demo-simple-select-label">Rota</InputLabel>
                                            <Input
                                                value={detailsCobranca?.rota}
                                                fullWidth
                                                label='Rota'
                                                margin="normal"
                                                size="small"
                                                disabled
                                            />
                                        </div>
                                            <div style={{ width: '100%', marginTop: '8px' }}>
                                                <InputLabel id="demo-simple-select-label">Caminhão</InputLabel>
                                            <Input
                                                value={detailsCobranca ? detailsCobranca?.frota[0]?.placa : ''}
                                                fullWidth
                                                label='Caminhão'
                                                margin="normal"
                                                size="small"
                                                disabled
                                                />
                                            </div>
                                            <div style={{  width: '100%', marginTop: '8px' }}>
                                                <InputLabel id="demo-simple-select-label">Tomador</InputLabel>
                                                <Input
                                                    value={detailsCobranca?.ctes[0]?.tomador.nome}
                                                    fullWidth
                                                    label='Tomador'
                                                    margin="normal"
                                                    size="small"
                                                    disabled
                                                />
                                            </div>
                                            <div style={{  width: '100%', marginTop: '8px' }}>
                                                <InputLabel id="demo-simple-select-label">Remetente</InputLabel>
                                                <Input
                                                    value={detailsCobranca?.ctes[0]?.remetente.nome}
                                                    fullWidth
                                                    label='Remetente'
                                                    margin="normal"
                                                    size="small"
                                                    disabled
                                                />
                                            </div>
                                            <div style={{  width: '100%', marginTop: '8px' }}>
                                                <InputLabel id="demo-simple-select-label">Destinatário</InputLabel>
                                                <Input
                                                    value={detailsCobranca?.ctes[0]?.destinatario.nome}
                                                    fullWidth
                                                    label='Destinatário'
                                                    margin="normal"
                                                    size="small"
                                                    disabled
                                                />
                                            </div>
                                            <div style={{  width: '100%', marginTop: '8px' }}>
                                                <InputLabel id="demo-simple-select-label">Ctes</InputLabel>
                                                <Input
                                                    value={
                                                        pegarCtes(detailsCobranca)
                                                    }
                                                    fullWidth
                                                    label='Ctes'
                                                    margin="normal"
                                                    size="small"
                                                    disabled
                                                />
                                            </div>
                                            <div style={{ width: '100%', marginTop: '8px' }}>
                                                <InputLabel id="demo-simple-select-label">Valor Total</InputLabel>
                                                <Input
                                                    value={`R$ ${formatMoney(detailsCobranca.valor_total_sj)}`}
                                                    fullWidth
                                                    label='Valor total'
                                                    margin="normal"
                                                    size="small"
                                                    disabled
                                                />
                                            </div>
                                                </>
                                    : 
                                    'Não foi selecionado viagem'
                                    }
                                    <div style={{ display: "flex", justifyContent: 'end', marginTop: '10px' }}>
                                        <Button align="end" variant="outlined" color="primary" onClick={handleCloseDetailsCobranca}>
                                            Fechar
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