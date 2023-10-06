import axios from "axios"

const BASE_URL = "http://localhost:4000/api"

// MOTORISTAS
async function listarMotoristas() {
    const promise = await axios.get(`${BASE_URL}/motorista`)
    return promise;
}

async function criarMotorista(formData) {
    const promise = await axios.post(`${BASE_URL}/motorista`, formData)
    return promise;
}

async function editarMotorista(formData) {
    const promise = await axios.patch(`${BASE_URL}/motorista/${formData.id}`, formData)
    return promise;
}

async function excluirMotorista(id) {
    const promise = await axios.delete(`${BASE_URL}/motorista/${id}`)
    return promise;
}

// CLIENTES 
async function listarClientes() {
    const promise = await axios.get(`${BASE_URL}/clientes`)
    return promise;
}

async function buscarCliente(id) {
    const promise = await axios.get(`${BASE_URL}/clientes/id`)
    return promise;
}

async function criarCliente(formData) {
    const promise = await axios.post(`${BASE_URL}/clientes`, formData)
    return promise;
}

async function editarCliente(formData) {
    const promise = await axios.patch(`${BASE_URL}/clientes/${formData._id}`, formData)
    return promise;
}

async function excluirCliente(id) {
    const promise = await axios.delete(`${BASE_URL}/clientes/${id}`)
    return promise;
}

// CLIENTES 
async function listarcaminhoes() {
    const promise = await axios.get(`${BASE_URL}/frota`)
    return promise;
}

async function criarCaminhao(formData) {
    const promise = await axios.post(`${BASE_URL}/frota`, formData)
    return promise;
}

async function editarCaminhao(formData) {
    const promise = await axios.patch(`${BASE_URL}/frota/${formData._id}`, formData)
    return promise;
}

async function excluirCaminhao(id) {
    const promise = await axios.delete(`${BASE_URL}/frota/${id}`)
    return promise;
}


// VIAGENS 

async function createViagem(formData) {
    const promise = await axios.post(`${BASE_URL}/viagem`, formData)
    return promise
}

async function listarViagens(formData) {
    console.log(formData)
    const promise = await axios.get(`${BASE_URL}/viagem`, {params: formData})
    return promise
}

async function excluirViagem(id) {
    const promise = await axios.delete(`${BASE_URL}/viagem/${id}`)
    return promise
}




export {
    listarMotoristas,
    criarMotorista,
    editarMotorista,
    excluirMotorista,
    listarClientes,
    buscarCliente,
    criarCliente,
    editarCliente,
    excluirCliente,
    listarcaminhoes,
    criarCaminhao,
    editarCaminhao,
    excluirCaminhao,
    createViagem,
    listarViagens,
    excluirViagem
}