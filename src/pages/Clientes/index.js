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
    Card
} from "@mui/material";
import { MagnifyingGlass } from 'react-loader-spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useState } from 'react';
import { Sidebar } from "../../components/sidebar";
import styled from "styled-components";
import * as api from "./../../Services/api";
import Swal from "sweetalert2";
import CNPJTextField from "../../components/cnpjTextField";


export default function Clientes() {

    const [clientes, setClientes] = useState([]);
    const [openModalNovoCliente, setOpenModalNovoCliente] = useState(false);
    const [openModalEditCliente, setOpenModalEditCliente] = useState(false);
    const [openModalDeleteCliente, setOpenModalDeleteCliente] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [novoCliente, setNovoCliente] = useState({
        nome: '',
        email: '',
        cpf_cnpj: '',
        valor_frete_subida: '',
        valor_frete_descida: ''
    });
    const [loading, setLoading] = useState(false);
    const [layoutLoading, setLayoutLoading] = useState(false);

    const handleNovoCliente = () => {
        setOpenModalNovoCliente(true);
    };

    const handleModalCloseNovoCliente = () => {
        setNovoCliente({});
        setOpenModalNovoCliente(false);
    }

    const handleEditClick = (client) => {
        setSelectedClient(client);
        setOpenModalEditCliente(true);
    };

    const handleModalCloseEditMotorista = () => {
        setSelectedClient({});
        setOpenModalEditCliente(false);
    }

    const handleDeleteClick = (client) => {
        setSelectedClient(client);
        setOpenModalDeleteCliente(true)
    };

    const handleModalCloseDeleteMotorista = () => {
        setSelectedClient({});
        setOpenModalDeleteCliente(false);
    }

    function getClientes() {
        setLayoutLoading(true)
        api.listarClientes().then((response) => {
            setClientes(response.data);
            setLayoutLoading(false);
        })
    }

    function createMotorista(e) {
        e.preventDefault()

        setLoading(true)

        const requiredFields = ['nome', 'email', 'cpf_cnpj'];
        const emptyFields = requiredFields.filter((field) => !novoCliente[field]);

        if (emptyFields.length > 0) {
            alert('Preencha os campos obrigatórios')
            setLoading(false)
        } else {

            api.criarCliente({ ...novoCliente, cpf_cnpj: novoCliente.cpf_cnpj.replace(/\D/g, "") }).then((response) => {
                setClientes((prevData) => [...prevData, response.data.cliente])
                Swal.fire({
                    position: 'center',
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
            setNovoCliente({});
            handleModalCloseNovoCliente();
        }
    }

    function editCliente(e) {
        e.preventDefault()
        setLoading(true)
        const requiredFields = ['nome', 'email', 'cpf_cnpj'];
        const emptyFields = requiredFields.filter((field) => !selectedClient[field]);

        if (emptyFields.length > 0) {
            Swal.fire({
                position: 'bottom-end',
                icon: 'error',
                title: `Os campos ${emptyFields.join(', ')} são obrigatórios.`,
                showConfirmButton: false,
                timer: 1500
            })
            setLoading(false)
        } else {
            api.editarCliente({ ...selectedClient, cpf_cnpj: selectedClient.cpf_cnpj.replace(/\D/g, "") }).then((response) => {
                const newData = [...clientes]
                const index = clientes.findIndex(m => m._id === response.data.cliente._id)

                newData[index] = response.data.cliente;

                setClientes(newData)
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
            setSelectedClient({});
            setOpenModalEditCliente(false);
        }
    }

    function excluirCliente(e) {
        e.preventDefault()

        setLoading(true)
        api.excluirCliente(selectedClient._id).then((response) => {
            const newData = [...clientes]
            const index = clientes.findIndex(m => m._id === selectedClient._id)

            newData.splice(index, 1);

            setClientes(newData)
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
        setSelectedClient({});
        setOpenModalDeleteCliente(false);
    }

    useEffect(() => {
        getClientes()
    }, [])

    return (
        <>
            <Sidebar />
            <ContainerBig maxWidth="80%">
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
                                Listagem de clientes
                            </Typography>
                            <Button align="center" variant="contained" color="primary" onClick={handleNovoCliente} style={{ marginBottom: '20px' }}>
                                Novo cliente
                            </Button>
                            <Card>
                                <TableContainer align="center">
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell style={{ width: '10%' }}>ID</TableCell>
                                                <TableCell style={{ width: '50%' }}>Cliente</TableCell>
                                                <TableCell style={{ width: '30%' }}>CNPJ</TableCell>
                                                <TableCell style={{ width: '10%' }}>Opções</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {clientes.map((client, i) => (
                                                <TableRow key={i + 1}>
                                                    <TableCell>{i + 1}</TableCell>
                                                    <TableCell>{client.nome}</TableCell>
                                                    <TableCell>
                                                        {client.cpf_cnpj}
                                                    </TableCell>
                                                    <TableCell>
                                                        <IconButton color="primary" onClick={() => handleEditClick(client)}>
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
                            <Modal open={openModalDeleteCliente} onClose={handleModalCloseDeleteMotorista}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Confirmar Exclusão
                                    </Typography>
                                    {selectedClient && (
                                        <Typography variant="body1">
                                            Tem certeza que deseja excluir o cliente {selectedClient.nome}?
                                        </Typography>
                                    )}
                                    <div style={{ display: "flex", justifyContent: 'end', marginTop: '10px' }}>
                                        <Button align="end" variant="outlined" color="primary" onClick={handleModalCloseDeleteMotorista} style={{ marginRight: '10px' }}>
                                            Cancelar
                                        </Button>
                                        <Button align="end" variant="contained" color="error" onClick={excluirCliente}>
                                            {loading ? 'Carregando...' : 'Excluir'}
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal open={openModalEditCliente} onClose={handleModalCloseEditMotorista}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '300px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Editar cliente
                                    </Typography>
                                    {selectedClient && (
                                        <div>
                                            <TextField
                                                label="Nome"
                                                value={selectedClient.nome}
                                                onChange={(e) => setSelectedClient({ ...selectedClient, nome: e.target.value })}
                                                fullWidth
                                                margin="normal"
                                                size="small"
                                                required
                                            />
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <TextField
                                                    label="Email"
                                                    value={selectedClient.email}
                                                    onChange={(e) => setSelectedClient({ ...selectedClient, email: e.target.value })}
                                                    fullWidth
                                                    margin="normal"
                                                    size="small"
                                                    required
                                                />
                                                <CNPJTextField
                                                    label="CNPJ"
                                                    value={selectedClient.cpf_cnpj}
                                                    onChange={(e) => setSelectedClient({ ...selectedClient, cpf_cnpj: e.target.value })}
                                                    fullWidth
                                                    variant="outlined"
                                                    size="small"
                                                    margin="normal"
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <TextField
                                                    label="Valor frete de romaneio - subida"
                                                    value={selectedClient.valor_frete_subida}
                                                    onChange={(e) => setSelectedClient({ ...selectedClient, valor_frete_subida: e.target.value })}
                                                    fullWidth
                                                    margin="normal"
                                                    size="small"
                                                    type="number"
                                                />
                                                <TextField
                                                    label="Valor frete de romaneio - descida"
                                                    value={selectedClient.valor_frete_descida}
                                                    onChange={(e) => setSelectedClient({ ...selectedClient, valor_frete_descida: e.target.value })}
                                                    fullWidth
                                                    margin="normal"
                                                    size="small"
                                                    type="number"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <Button variant="outlined" color="primary" onClick={handleModalCloseEditMotorista} style={{ marginRight: '10px' }}>
                                            Cancelar
                                        </Button>
                                        <Button variant="contained" color="success" onClick={editCliente}>
                                            {loading ? 'Carregando...' : 'Salvar'}
                                        </Button>
                                    </div>
                                </div>
                            </Modal>
                            <Modal open={openModalNovoCliente} onClose={handleModalCloseNovoCliente}>
                                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', minWidth: '500px', borderRadius: '4px' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Cadastrar Novo Cliente
                                    </Typography>
                                    <TextField
                                        label="Nome"
                                        value={novoCliente.nome}
                                        onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                                        fullWidth
                                        margin="normal"
                                        size="small"
                                        required
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <TextField
                                            label="Email"
                                            value={novoCliente.email}
                                            onChange={(e) => setNovoCliente({ ...novoCliente, email: e.target.value })}
                                            fullWidth
                                            margin="normal"
                                            size="small"
                                            required
                                        />
                                        <CNPJTextField
                                            label="CNPJ"
                                            value={novoCliente.cpf_cnpj}
                                            onChange={(e) => setNovoCliente({ ...novoCliente, cpf_cnpj: e.target.value })}
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            margin="normal"
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <TextField
                                            label="Valor frete de romaneio - subida"
                                            value={novoCliente.valor_frete_subida}
                                            onChange={(e) => setNovoCliente({ ...novoCliente, valor_frete_subida: e.target.value })}
                                            fullWidth
                                            margin="normal"
                                            size="small"
                                            type="number"
                                        />
                                        <TextField
                                            label="Valor frete de romaneio - descida"
                                            value={novoCliente.valor_frete_descida}
                                            onChange={(e) => setNovoCliente({ ...novoCliente, valor_frete_descida: e.target.value })}
                                            fullWidth
                                            margin="normal"
                                            size="small"
                                            type="number"
                                        />
                                    </div>
                                    <Button variant="outlined" color="primary" onClick={handleModalCloseNovoCliente} style={{ marginRight: '10px' }}>
                                        Cancelar
                                    </Button>
                                    <Button variant="contained" color="primary" onClick={createMotorista} loading>
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
