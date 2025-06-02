import React, { useEffect } from 'react';
// Controller é usado para conectar os campos do formulário ao estado do formulário gerenciado pelo useForm.
// O Controller é um componente que envolve o campo do formulário e fornece as propriedades e métodos necessários para gerenciar o estado do campo.
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar, } from '@mui/material';
import IMaskInputWrapper from '../components/IMaskInputWrapper';
// import dos services de cliente, faz a comunicação com o backend
import { createCliente, updateCliente, getClienteById } from '../services/clienteService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';

const ClienteForm = () => {

    // O useParams retorna um objeto com os parâmetros da URL, que podem ser acessados pelas chaves correspondentes.Add commentMore actions
    // O id é o parâmetro da URL que representa o id do cliente a ser editado ou visualizado.
    // O opr é o parâmetro da URL que representa a operação a ser realizada (edit ou view).
    const { id, opr } = useParams();

    // useNavigate é usado para navegar entre páginas.
    const navigate = useNavigate();

    // useForm: usado para gerenciar o estado do formulário, como os valores dos campos e as validações.
    // O useForm retorna um objeto com várias propriedades e métodos, como control, handleSubmit, reset e formState.
    // control: usado para conectar os campos do formulário ao estado do formulário gerenciado pelo useForm.
    // handleSubmit: função que lida com o envio do formulário e valida os dados.
    // reset: função que redefine os valores do formulário para os valores iniciais.
    // formState: objeto que contém o estado do formulário, como erros de validação e se o formulário está sendo enviado.

    const { control, handleSubmit, reset, formState: { errors } } = useForm();

    // se opr for 'view', será utilizada para ajustar o formulário como somente leituraAdd commentMore actions
    const isReadOnly = opr === 'view';

    // title: variável que define o título do formulário com base na operação e no id
    let title;
    if (opr === 'view') {
        title = `Visualizar Cliente: ${id}`;
    } else if (id) {
        title = `Editar Cliente: ${id}`;
    } else {
        title = "Novo Cliente";
    }

    // useEffect: usado para executar efeitos colaterais, como buscar dados do backend ou atualizar o estado do componente.
    // useEffect é um hook que permite executar efeitos colaterais em componentes funcionais.
    // Ele recebe uma função de efeito e um array de dependências como argumentos.
    // A função de efeito é executada após a renderização do componente e
    // pode retornar uma função de limpeza que é executada antes da próxima execução do efeito ou da desmontagem do componente.
    // A dependência id é usada para buscar os dados do cliente a ser editado ou visualizado.
    useEffect(() => {
        if (id) {
            // define uma função assíncrona para buscar os dados do cliente pelo id.
            const fetchCliente = async () => {
                const data = await getClienteById(id);
                // O reset é uma função do react-hook-form que redefine os valores do formulário,
                // no caso, para os valores retornados da consulta.
                reset(data);
            };
            // Chama a função fetchCliente para buscar os dados do cliente.
            fetchCliente();
        }
    }, [id, reset]);

    // onSubmit: função chamada quando o formulário é enviado. Ela recebe os dados do formulário como argumento.
    // A função onSubmit verifica se o id está presente. Se estiver, chama a função updateCliente para atualizar os dados do cliente.
    // Caso contrário, chama a função createCliente para criar um novo cliente.
    // Após a operação, navega para a página de clientes.
    const onSubmit = async (data) => {
        try {
            let retorno;
            if (id) {
                retorno = await updateCliente(id, data);
            } else {
                retorno = await createCliente(data);
            }

            // a api, nos casos de sucesso, retorna um objeto com a propriedade id
            if (!retorno || !retorno.id) {
                // a api, nos casos de erro, retorna um objeto com a propriedade erro
                throw new Error(retorno.erro || "Erro ao salvar Cliente.");  
            }

            toast.success(`Cliente salvo com sucesso. ID: ${retorno.id}`, {position: "top-center"});
            navigate('/clientes');
        } catch (error) {
            toast.error(`Erro ao salvar cliente: \n${error.message}`, {position: "top-center"});
        }
    };

    return (
        
        // O Box é um componente do Material-UI que pode ser usado como um contêiner flexível para outros componentes.Add commentMore actions
        // O component="form" indica que o Box deve ser tratado como um elemento de formulário HTML.
        // O onSubmit é uma função que será chamada quando o formulário for enviado.

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>

            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" gutterBottom color="primary">{title}</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>

                {opr === 'view' && (
                    <Typography variant = "body2" color = "textSecondary" sx={{ mb: 2 }}>
                        Todos os campos estão em modo somente leitura.
                    </Typography>
                )}

                <Controller name="nome" control={control} defaultValue="" rules={{required: "Nome é obrigatório" }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Nome" fullWidth margin='normal' error={!!errors.nome} helperText={errors.nome?.message} />
                    )}
                />

                {/* CPF com máscara */}
                <Controller name="cpf" control={control} defaultValue="" rules={{ required: "CPF é obrigatório" }}
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="CPF" fullWidth margin="normal" error={!!errors.cpf} helperText={errors.cpf?.message}
                            InputProps={{
                                // Define o IMaskInputWrapper como o componente de entrada
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "000.000.000-00",
                                    // O regex [0-9] ou \d aceita apenas números de 0 a 9
                                    definitions: {
                                        "0": /\d/,
                                    },
                                    // Retorna apenas os números no valor
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />
                
                {/* Telefone com máscara */}
                <Controller name="telefone" control={control} defaultValue=""
                    render={({ field }) => (
                        <TextField {...field} disabled={isReadOnly} label="Telefone" fullWidth margin="normal" error={!!errors.telefone} helperText={errors.telefone?.message}
                            InputProps={{
                                // Define o IMaskInputWrapper como o componente de entrada
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "(00) 00000-0000",
                                    // O regex [0-9] ou \d aceita apenas números de 0 a 9
                                    definitions: {
                                        "0": /\d/,
                                    },
                                    // Retorna apenas os números no valor
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button onClick={() => navigate('/clientes')} sx={{ mr: 1 }}>Cancelar</Button>

                    {opr !== 'view' && (
                        <Button type="submit" variant="contained" color="primary">{id ? "Atualizar" : "Cadastrar"}</Button>
                    )}
                </Box>

            </Box>

        </Box>
    );
};

export default ClienteForm;