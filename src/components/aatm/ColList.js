import { Card, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Children } from "react";

export const ColList = ({ childrens, headers }) => {
    return (
        <Card align="center">
            <TableContainer align="center">
                <Table sx={{ maxWidth: 500 }}>
                    <TableHead>
                        <TableRow>
                            {headers.map((header, i) => (
                                <TableCell key={i}>{header.nome}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Children.map(childrens, (child, index) => (
                            <TableRow key={index}>
                                {child}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}