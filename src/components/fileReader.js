import React, { useState } from 'react';
import { Button } from '@mui/material';

const FileUploader = (props) => {
    const [files, setFiles] = useState([]);
    const [parsedData, setParsedData] = useState([]);

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files;
        setFiles(selectedFiles);
    };

    const handleFileUpload = async () => {
        const data = [];

        for (const file of files) {
            try {
                const content = await readFileAsync(file);
                const parsedObject = parseXML(content);
                data.push(parsedObject);
            } catch (error) {
                console.error('Erro ao ler/parsear arquivo XML:', error);
            }
        }
        // Agora 'data' contém os objetos JavaScript representando os XML
        const arrFormatada = formatItensXml(data)
        console.log(arrFormatada)
        setParsedData(arrFormatada);
        props.setCtes(arrFormatada)
        props.setClose(false)
    };

    const formatItensXml = (ctes) => {
        return ctes.map((cte) => {
            // PEGAR TOMADOR
            let tomador;
            if (cte.CTe.infCte.ide.toma3.toma['#text'] === 0) {
                tomador = {
                    cnpj: cte.CTe.infCte.rem.CNPJ['#text'],
                    nome: cte.CTe.infCte.rem.xNome['#text'],
                    endereco: {
                        cidade: cte.CTe.infCte.rem.enderReme.xMun['#text'],
                        uf: cte.CTe.infCte.rem.enderReme.UF['#text']
                    },
                }
            } else if (cte.CTe.infCte.ide.toma3.toma['#text'] === 1) {
                tomador = {
                    cnpj: cte.CTe.infCte.dest.CNPJ['#text'],
                    nome: cte.CTe.infCte.dest.xNome['#text'],
                    endereco: {
                        cidade: cte.CTe.infCte.dest.enderDest.xMun['#text'],
                        uf: cte.CTe.infCte.dest.enderDest.UF['#text']
                    },
                }
            }

            return {
                infos_cte: {
                    chave: cte.protCTe.infProt.chCTe['#text'],
                    numero: cte.CTe.infCte.ide.nCT['#text'],
                    data_emissao: cte.CTe.infCte.ide.dhEmi['#text'],
                },
                remetente: {
                    cnpj: cte.CTe.infCte.rem.CNPJ['#text'],
                    nome: cte.CTe.infCte.rem.xNome['#text'],
                    endereco: {
                        cidade: cte.CTe.infCte.rem.enderReme.xMun['#text'],
                        uf: cte.CTe.infCte.rem.enderReme.UF['#text']
                    },
                },
                destinatario: {
                    cnpj: cte.CTe.infCte.dest.CNPJ['#text'],
                    nome: cte.CTe.infCte.dest.xNome['#text'],
                    endereco: {
                        cidade: cte.CTe.infCte.dest.enderDest.xMun['#text'],
                        uf: cte.CTe.infCte.dest.enderDest.UF['#text']
                    },
                },
                tomador: tomador,
                info_frete: {
                    valor_carga: cte.CTe.infCte.infCTeNorm.infCarga.VCarga['#text'],
                    peso_carga: cte.CTe.infCte.infCTeNorm.infCarga.infQ.find((carga) => carga.tpMed['#text'] === 'PESO BRUTO').qCarga['#text'],
                    unidade_carga: cte.CTe.infCte.infCTeNorm.infCarga.infQ.find((carga) => carga.tpMed['#text'] === 'UNIDADE').qCarga['#text'],
                    valor_frete_cte: cte.CTe.infCte.VPrest.Comp.VComp['#text']
                }
            }
        })
    }

    const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsText(file);
        });
    };

    const parseXML = (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

        // Função recursiva para converter o documento XML em um objeto JavaScript
        const xmlToJson = (node) => {
            const obj = {};

            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.hasChildNodes()) {
                    for (const childNode of node.childNodes) {
                        const childData = xmlToJson(childNode);
                        if (obj[childNode.nodeName]) {
                            if (!Array.isArray(obj[childNode.nodeName])) {
                                obj[childNode.nodeName] = [obj[childNode.nodeName]];
                            }
                            obj[childNode.nodeName].push(childData);
                        } else {
                            obj[childNode.nodeName] = childData;
                        }
                    }
                }
                if (node.attributes.length > 0) {
                    obj['attributes'] = {};
                    for (const attr of node.attributes) {
                        obj['attributes'][attr.name] = attr.value;
                    }
                }
            } else if (node.nodeType === Node.TEXT_NODE) {
                return node.nodeValue.trim();
            }

            return obj;
        };

        return xmlToJson(xmlDoc.documentElement);
    };

    return (
        <div>
            <input
                type="file"
                multiple
                accept=".xml"
                onChange={handleFileChange}
                id="fileInput"
            />
            <Button variant="contained" color="primary" onClick={handleFileUpload}>
                Criar viagem
            </Button>
        </div>
    );
};

export default FileUploader;
