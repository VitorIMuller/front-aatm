import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Modal, Button, TextField, Select, MenuItem, InputLabel, Input, InputAdornment } from "@mui/material";
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import FileUploader from "../../components/fileReader";
import { blue } from "@mui/material/colors";
import * as api from "./../../Services/api"
import moment from "moment";

export default function NovaViagem() {
    const [openModalCte, setopenModalCte] = useState(false);
    const [openModalConfirm, setopenModalConfirm] = useState(false);
    const [ctes, setCtes] = useState([]);
    const [viagem, setViagem] = useState([]);
    const [caminhoes, setCaminhoes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [atualizarFrete, setAtualizarFrete] = useState(false)

    const rota = [
        {
            id: 'SC-SP',
            nome: 'SC-SP'
        },
        {
            id: 'SP-SC',
            nome: 'SP-SC'
        }
    ]

    const handleCloseAddCtes = () => {
        console.log('opa')
        setAtualizarFrete(!atualizarFrete)
        setopenModalCte(false);
    }

    const handleCloseModalConfirm = () => {
        setopenModalConfirm(false);
    }

    const handleAddCtes = () => {
        setopenModalCte(true);
    };

    function getCaminhoes() {
        api.listarcaminhoes().then((response) => {
            setCaminhoes(response.data)
        })
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

    const calcularFrete = () => {
        api.listarClientes().then((response) => {
            setClientes(response.data)
        })
        const cliente = clientes.find(cliente => cliente.cpf_cnpj === ctes[0]?.tomador.cnpj)
        let newArr = []
        if (ctes?.length > 0) {
            if (cliente) {
                newArr = ctes.map((cte) => {
                    return {
                        ...cte,
                        info_frete: {
                            ...cte.info_frete,
                            valor_romaneio: cliente.valor_frete_sj * cte.info_frete.peso_carga,
                            valor_total: cliente.valor_frete_sj * cte.info_frete.peso_carga + parseFloat(cte.info_frete.valor_frete_cte)
                    }
                }
            })
        } else {
            alert('CNPJ do tomador não encontrado, por favor, cadastre o cliente antes de cadastrar a viagem')
        }
    }
            
        setCtes(newArr)
    }

    const createViagem = () => {
        const form = {
            ...viagem,
            ...{
                data_inicio: moment().format('YYYY-MM-DD'),
                ctes,
                valor_total_sj: ctes.reduce((acc, cur) => {
                    return acc + cur.info_frete.valor_total
                }, 0).toFixed(2),
                valor_total_lp: (ctes.reduce((acc, cur) => {
                    return acc + cur.info_frete.valor_total
                }, 0) - viagem.despesas).toFixed(2)
            }
        }
        api.createViagem(form).then((response) => {
            alert(response.msg)
            setCtes([])
            setViagem([])
            setLoading(false)
            handleCloseModalConfirm()
        }).catch((err) => {
            alert('Ocorreu um erro')
            setLoading(false)
        })
    }
    useEffect(() => {
        getCaminhoes()
    }, [])

    useEffect(() => {
            calcularFrete()
    }, [atualizarFrete])


    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="md">
                <Typography variant="h5" align="center" gutterBottom style={{ fontWeight: 'bold' }}>
                    Nova viagem
                </Typography>
                <Button align="center" variant="contained" color="primary" style={{ marginBottom: '20px' }} onClick={handleAddCtes}>
                    Adicionar CTES
                </Button>
                {ctes?.length > 0 && ( 
                    <>
                <div style={{ backgroundColor: blue, width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                    <div style={{width: '40%'}}>
                        <InputLabel id="demo-simple-select-label">Caminhão</InputLabel>
                        <Select
                            value={setViagem.frota_id}
                            onChange={(e) => setViagem({ ...viagem, frota_id: e.target.value })}
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
                    <div style={{ width: '40%', marginTop: '8px' }}>
                        <InputLabel id="demo-simple-select-label">Tomador</InputLabel>
                        <Input
                            value={ctes[0]?.tomador.nome}
                            fullWidth
                            label='Tomador'
                            margin="normal"
                            size="small"
                            disabled
                            variant="outlined"
                            />
                            </div>
                        </div>
                        <div>
                            
                        <div style={{ backgroundColor: blue, width: '100%', display: 'flex', justifyContent: 'space-around' }}>
                            <div style={{ width: '40%' }}>
                                <InputLabel id="demo-simple-select-label">Rota</InputLabel>
                                <Select
                                    value={setViagem.rota}
                                    onChange={(e) => setViagem({ ...viagem, rota: e.target.value })}
                                    fullWidth
                                    required
                                    size="small"
                                    margin="normal"
                                >
                                    {rota.map((f) => (
                                        <MenuItem key={f.id} value={f.id}>
                                            {f.nome}
                                        </MenuItem>
                                    ))}
                                </Select>
                                </div>
                                <div style={{ width: '40%', marginTop: '8px' }}>
                                    <InputLabel id="demo-simple-select-label">Valor das despesas</InputLabel>
                                    <Input
                                        value={viagem.despesas}
                                        onChange={(e) => setViagem({ ...viagem, despesas: e.target.value })}
                                        startAdornment={<InputAdornment position="start">R$</InputAdornment>}
                                        fullWidth
                                        label='Despesas'
                                        margin="normal"
                                        size="small"
                                        number
                                        variant="outlined"
                                    />
                                </div>
                        </div>
                    <TableContainer align="center">
                        <Table sx={{ maxWidth: '100%' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nº</TableCell>
                                    <TableCell>Valor Carga</TableCell>
                                    <TableCell style={{ display: 'flex', justifyContent: 'center' }}>Unidades</TableCell>
                                    <TableCell>Peso Bruto</TableCell>
                                    <TableCell>Valor Frete CTE</TableCell>
                                    <TableCell>Valor Frete Romaneio</TableCell>
                                    <TableCell>Valor Frete Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {ctes.map((cte, i) => (
                                    <TableRow key={i + 1}>
                                        <TableCell>{ cte.infos_cte.numero }</TableCell>
                                        <TableCell>R$ { cte.info_frete.valor_carga }</TableCell>
                                        <TableCell style={{display: 'flex', justifyContent: 'center'}}>{ cte.info_frete.unidade_carga }</TableCell>
                                        <TableCell>{cte.info_frete.peso_carga} Kg</TableCell>
                                        <TableCell> R$ {formatMoney(cte.info_frete.valor_frete_cte)}</TableCell>
                                        <TableCell> R$ {formatMoney(cte.info_frete.valor_romaneio)}</TableCell>
                                        <TableCell> R$ {formatMoney(cte.info_frete.valor_total)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div style={{ display: 'flex', justifyContent: 'end', marginRight: '5%', marginTop: '10px', marginBottom: '10px' }}>
                            <Button variant="contained" color="primary" onClick={() => setopenModalConfirm(true)} loading>
                                {loading ? 'Carregando...' : 'Cadastrar'}
                            </Button>
                        </div>
                    </TableContainer>
                        </div>
                    </>
                )}
                <Modal open={openModalCte} onClose={handleCloseAddCtes}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        <FileUploader ctes={ctes} setCtes={setCtes} setClose={handleCloseAddCtes} />
                    </div>
                </Modal>
                <Modal open={openModalConfirm} onClose={handleCloseModalConfirm}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                        Deseja criar uma viagem com o valor total de <strong>
                        R$ {
                            ctes.reduce((acc, cur) => {
                                return acc + cur.info_frete.valor_total
                            }, 0).toFixed(2)
                        }
                        </strong>
                        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '10px' }}>
                            <Button variant="contained" color="success" onClick={() => createViagem()} loading>
                                {loading ? 'Carregando...' : 'Sim, criar'}
                            </Button>
                        </div>
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
