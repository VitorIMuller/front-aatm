import styled from "styled-components";
import { Sidebar } from "../../components/sidebar";
import { Button, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useState } from "react";
// import ptBR from "date-fns/locale/pt-BR"; 
import { ptBR } from "@mui/x-date-pickers";
import { useEffect } from "react";
import moment from "moment";

import * as api from "./../../Services/api"
import dayjs from "dayjs";

const brLocale = ptBR.components.MuiLocalizationProvider.defaultProps.localeText;
export default function Home() {
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [placa, setPlaca] = useState('')
    const [caminhoes, setCaminhoes] = useState([])


    function getCaminhoes() {
        api.listarcaminhoes().then((response) => {
            setCaminhoes(response.data)
        })
    }

    function gerarRelatorio(e) {
        e.preventDefault()
        if (dataInicio && dataFim) {
            const form = {
                data_inicio: dayjs(dataInicio).format('YYYY-MM-DD'),
                data_fim: dayjs(dataFim).format('YYYY-MM-DD'),
                placa: placa 
            }
            
            api.listarViagens(form).then((res) => {
                if (res.length === 0) {
                    alert('Não foram encontrados registros')
                }
            })
        } else {
            alert('Selecione data de início e fim')
        }
    }

    useEffect(() => {
        getCaminhoes()
    }, [])
    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="md">
                <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
                    Relatório de viagens
                </Typography>
                <div style={{display: 'flex'}}>

                <div style={{display: 'flex', justifyContent: 'center', width: '50%'}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} localeText={brLocale}>
                        <DemoContainer components={['DatePicker']}>
                            <DatePicker label="Data início" format="DD/MM/YYYY" value={dataInicio} onChange={(newValue) => setDataInicio(newValue)} />
                            <DatePicker label="Data fim" format="DD/MM/YYYY" value={dataFim} onChange={(newValue) => setDataFim(newValue)} />
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
                <div style={{width: '30%'}}>
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
