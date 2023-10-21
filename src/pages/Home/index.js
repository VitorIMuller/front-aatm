import styled from "styled-components";
import { Sidebar } from "../../components/sidebar";
import { Button, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react"; 
import { ptBR } from "@mui/x-date-pickers";
import { useEffect } from "react";
import * as api from "./../../Services/api"
import dayjs from "dayjs";

const brLocale = ptBR.components.MuiLocalizationProvider.defaultProps.localeText;
export default function Home() {
    const [dataInicio, setDataInicio] = useState(dayjs().startOf('month'))
    const [dataFim, setDataFim] = useState(dayjs().endOf('month'))
    const [placa, setPlaca] = useState('')
    const [caminhoes, setCaminhoes] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cliente, setCliente] = useState([]);

    function getCaminhoes() {
        api.listarcaminhoes().then((response) => {
            setCaminhoes(response.data)
        })
    }

    function getClientes() {
        api.listarClientes().then((response) => {
            setClientes(response.data)
        })
    }

    function limparFiltros() {
        setCliente('')
        setPlaca('')
        setDataInicio(dayjs().startOf('month'))
        setDataFim(dayjs().endOf('month'))
    }

    function gerarRelatorio(e) {
        e.preventDefault()
        if (dataInicio && dataFim) {
            const form = {
                data_inicio: dayjs(dataInicio).format('YYYY-MM-DD'),
                data_fim: dayjs(dataFim).format('YYYY-MM-DD'),
                placa: placa?.placa,
                placa_id: placa?._id,
                cliente: cliente?.nome,
                cliente_id: cliente?._id
            }
            setCliente('')
            setPlaca('')
            setDataInicio(dayjs().startOf('month'))
            setDataFim(dayjs().endOf('month'))
            window.open(`relatorio?filtros=${JSON.stringify(form)}`)
        } else {
            alert('Selecione data de início e fim')
        }
    }

    useEffect(() => {
        getCaminhoes()
            getClientes()
    }, [])
    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="md">
                <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
                    Relatório de viagens
                </Typography>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
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
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                        <div style={{ width: '25%', marginRight: '10px' }}>
                            <InputLabel id="demo-simple-select-label">Caminhão</InputLabel>
                            <Select
                                value={placa}
                                onChange={(e) => setPlaca(e.target.value)}
                                fullWidth
                                required
                                size="small"
                                margin="normal"
                                >
                                {caminhoes.map((f) => (
                                    <MenuItem key={f._id} value={f}>
                                        {f.placa}
                                    </MenuItem>
                                ))}
                                </Select>
                                </div>
                                <div style={{ width: '25%' }}>
                                <InputLabel id="demo-simple-select-label">Tomador</InputLabel>
                                <Select
                                    value={cliente}
                                    onChange={(e) => setCliente(e.target.value)}
                                    fullWidth
                                    required
                                    size="small"
                                    margin="normal"
                                    >
                                    {clientes.map((f) => (
                                        <MenuItem key={f._id} value={f}>
                                            {f.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Button align="center" variant="outlined" color="primary" onClick={limparFiltros} style={{marginRight: '10px'}}>
                        Limpar filtros
                    </Button>
                    <Button align="center" variant="contained" color="primary" onClick={gerarRelatorio}>
                        Buscar
                    </Button>
                </div>
                </div>

            </ContainerBig>
        </>
    )
}


const ContainerBig = styled.div`
    margin-top: 100px;
    margin-left: 100px;
    margin-right: 100px;
`
