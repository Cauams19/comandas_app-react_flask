// useEffect executar efeitos colaterais, como buscar dados da API / Proxy/BFF ao carregar o componente.
// useState gerenciar o estado local do componente, como a lista de funcionários.
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Toolbar, Typography, IconButton, Button, useMediaQuery, } from '@mui/material';
import { Edit, Delete, Visibility, FiberNew } from '@mui/icons-material';
// useNavigate navegar entre páginas.
import { useNavigate } from 'react-router-dom';
// serviços - funções para buscar e deletar funcionários
import { getFuncionarios, deleteFuncionario } from '../services/funcionarioService';
// mensagens de sucesso, erro e confirmação
import { toast } from 'react-toastify';
// useTheme para acessar o tema do Material-UI.
import { useTheme } from '@mui/material/styles';

function FuncionarioList() {

    const navigate = useNavigate();

    return (
        <TableContainer component={Paper}>

            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Funcionários</Typography>
                <Button color="primary" onClick={() => navigate('/funcionario')} startIcon={<FiberNew />}>Novo</Button>
            </Toolbar>
            
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nome</TableCell>
                        <TableCell>CPF</TableCell>
                        <TableCell>Matrícula</TableCell>
                        <TableCell>Ações</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow key={1}>
                        <TableCell>10</TableCell>
                        <TableCell>Abc</TableCell>
                        <TableCell>12345</TableCell>
                        <TableCell>678</TableCell>
                        <TableCell>
                            <IconButton> <Visibility color="primary" /> </IconButton>
                            <IconButton> <Edit color="secondary" /> </IconButton>
                            <IconButton> <Delete color="error" /> </IconButton>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>

    );
}
export default FuncionarioList;