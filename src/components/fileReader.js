import React, { useState } from 'react';
import { Button, Paper, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUploader = () => {
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
        console.log(data)
        // Agora 'data' contém os objetos JavaScript representando os XML
        setParsedData(data);
    };

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
