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
import { useNavigate } from 'react-router-dom';
import * as api from "./../../Services/api"
import dayjs from "dayjs";

const brLocale = ptBR.components.MuiLocalizationProvider.defaultProps.localeText;
export default function Home() {
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [placa, setPlaca] = useState('')
    const [caminhoes, setCaminhoes] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cliente, setCliente] = useState([]);
    const navigate = useNavigate()


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

    function gerarRelatorio(e) {
        e.preventDefault()
        if (dataInicio && dataFim) {
            const form = {
                data_inicio: dayjs(dataInicio).format('YYYY-MM-DD'),
                data_fim: dayjs(dataFim).format('YYYY-MM-DD'),
                placa: placa,
                cliente_id: cliente
            }
            
            api.listarViagens(form).then((res) => {
                console.log(res)
                if (res.data.length === 0) {
                    alert('Não foram encontrados registros')
                } else {
                    const myArray = res.data
                    navigate('/relatorio',  { state: { myArray } } );
                }
            })
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
                            <DatePicker label="Data início" format="DD/MM/YYYY" value={dataInicio} onChange={(newValue) => setDataInicio(newValue)} />
                            <DatePicker label="Data fim" format="DD/MM/YYYY" value={dataFim} onChange={(newValue) => setDataFim(newValue)} />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                        <div style={{ width: '20%', marginRight: '10px' }}>

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
                            <MenuItem key={f._id} value={f._id}>
                                {f.placa}
                            </MenuItem>
                        ))}
                        </Select>
                        </div>
                        <div style={{ width: '20%' }}>
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
                                <MenuItem key={f._id} value={f._id}>
                                    {f.nome}
                                </MenuItem>
                            ))}
                        </Select>
                            </div>
                        </div>
                <div style={{ width: '20%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'  }}>
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
