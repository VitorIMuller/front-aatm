import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Button
} from "@mui/material";
import moment from "moment";
import { useState, useEffect } from "react";
import styled from "styled-components";
import * as api from "./../../Services/api"
import { MagnifyingGlass } from "react-loader-spinner";
import dayjs from "dayjs";
import PrintIcon from '@mui/icons-material/Print';

export default function Relatorio() {

    const [viagens, setViagens] = useState([])
    const [infos, setInfos] = useState({
        data_inicio: '',
        data_fim: '',
        tomador: '',
        frota: ''
    })
    const [layoutLoading, setLayoutLoading] = useState(false)

    const formatMoney = (value) => {
        return value
            ? Number.parseFloat(value)
                .toFixed(2)
                .split('.')
                .join(',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            : '0,00'
    }

    async function listarViagens() {
        setLayoutLoading(true)
        const urlParams = new URLSearchParams(window.location.search);
        const filtros = urlParams.get('filtros');
        const newFiltros = JSON.parse(filtros)
        await api.listarViagens({
            placa: newFiltros.placa_id ? newFiltros.placa_id : null,
            cliente_id: newFiltros.cliente_id ? newFiltros.cliente_id : null,
            data_inicio: newFiltros.data_inicio,
            data_fim: newFiltros.data_fim
        })
            .then((res) => {
            
            setInfos({
                data_inicio: newFiltros.data_inicio,
                data_fim: newFiltros.data_fim,
                frota: newFiltros.placa ? newFiltros.placa : 'Não informado',
                tomador: newFiltros.cliente ? newFiltros.cliente : 'Não informado'
            })
                
                const viagensFormatadas = res.data.map((viagem) => {
                    const totalRomaneio = viagem.ctes.reduce((acc, cur) => {
                        acc = acc + parseFloat(cur.info_frete.valor_romaneio)
                        return acc
                    }, 0)

                    const totalCte = viagem.ctes.reduce((acc, cur) => {
                        acc = acc + parseFloat(cur.info_frete.valor_frete_cte)
                        return acc
                    }, 0)

                    return {
                        ...viagem,
                        ...{
                            total_romaneio: totalRomaneio,
                            total_cte: totalCte
                        }
                    }
            })
                
            setViagens(viagensFormatadas)
        })
        .catch((err) => {
            alert('ops! ocorreu um erro')
        })
        setLayoutLoading(false)
    }

    function handlePrint() {
        window.print();
    }

    useEffect(() => {
        listarViagens()
    }, [])

    return (
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
                            Relatório de viagens
                        </Typography>
                        {   viagens?.length ?
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', width: '100vw', marginLeft: '10px'}}>
                                <div>
                                    Período: {dayjs(infos?.data_inicio).format('DD/MM/YYYY')} - {dayjs(infos?.data_fim).format('DD/MM/YYYY')}
                                </div>
                                <div>
                                    Tomador: {infos?.tomador}
                                </div>
                                <div>
                                    Caminhão: {infos?.frota}
                                </div>
                            </div>
                            : ''
                        }
                        <TableContainer align="center">
                            {viagens?.length ? 
                                <Table sx={{ maxWidth: '80%' }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Data de inicio</TableCell>
                                            <TableCell>Caminhão</TableCell>
                                            <TableCell>Rota</TableCell>
                                            <TableCell>Tomador</TableCell>
                                            <TableCell>Valor CTE</TableCell>
                                            <TableCell>Valor Romaneio</TableCell>
                                            <TableCell>Valor Total</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {viagens.map((viagem, i) => (
                                            <TableRow key={i + 1}>
                                                <TableCell>{moment(viagem.data_inicio).format('DD/MM/YYYY')}</TableCell>
                                                <TableCell>{viagem.frota[0].placa}</TableCell>
                                                <TableCell>{viagem.rota}</TableCell>
                                                <TableCell>{viagem.ctes[0].tomador.nome}</TableCell>
                                                <TableCell>R$ {formatMoney(viagem.total_cte)}</TableCell>
                                                <TableCell>R$ {formatMoney(viagem.total_romaneio)}</TableCell>
                                                <TableCell>R$ {formatMoney(viagem.valor_total_sj)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                :
                                    'Ops! Não foram encontrados registros com os filtros selecionados'
                            }
                        </TableContainer>
                    </>
            }
            <div>

            <Button
                variant="contained"
                color="primary"
                onClick={handlePrint}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                }}
                className="hide-on-print"
                >
                    <PrintIcon style={{marginRight: '5px'}} />
                    Imprimir
                </Button>
                <style>
                    {`
                        @media print {
                            .hide-on-print {
                                display: none;
                            }
                            @page {
                            size: landscape;
                            }
                        }
                    `}
                </style>
                </div>
        </ContainerBig>
    )
}

const ContainerBig = styled.div`
    width: 100%
`
