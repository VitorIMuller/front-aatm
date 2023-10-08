import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import moment from "moment";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

export default function Relatorio() {
    const location = useLocation();
    const myArray = location.state.myArray;

    const formatMoney = (value) => {
        return value
            ? Number.parseFloat(value)
                .toFixed(2)
                .split('.')
                .join(',')
                .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
            : '0,00'
    }
    return (
        <ContainerBig maxWidth="md">
            <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
                Listagem de viagens
            </Typography>
            <TableContainer align="center">
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
                        {myArray.map((viagem, i) => (
                            <TableRow key={i + 1}>
                                <TableCell>{moment(viagem.data_inicio).format('DD/MM/YYYY')}</TableCell>
                                <TableCell>{viagem.frota[0].placa}</TableCell>
                                <TableCell>{viagem.rota}</TableCell>
                                <TableCell>{viagem.ctes[0].tomador.nome}</TableCell>
                                <TableCell>R$ {formatMoney(viagem.valor_total_lp)}</TableCell>
                                <TableCell>R$ {formatMoney(viagem.valor_total_sj)}</TableCell>
                                <TableCell>R$ {formatMoney(viagem.valor_total_lp+viagem.valor_total_sj)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </ContainerBig>
    )
}

const ContainerBig = styled.div`
`