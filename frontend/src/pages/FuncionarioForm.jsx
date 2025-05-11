import { useForm, Controller } from 'react-hook-form';  // incluído controller para as máscaras
import React from "react";
import { TextField, Button, Box, Typography, MenuItem, FormControl, InputLabel, Select, Toolbar } from '@mui/material';

// import do IMaskInputWrapper, que é o wrapper do IMaskInput
import IMaskInputWrapper from '../components/IMaskInputWrapper';

const FuncionarioForm = () => {
    const { control, register, handleSubmit, reset, formState: { errors } } = useForm();
    // o controle é usado para gerenciar o estado do formulário e as entradas controladas, como o IMaskInputWrapper.
    // o controle é necessário para integrar o IMaskInputWrapper com o react-hook-form,
    // permitindo que o valor da entrada seja gerenciado pelo react-hook-form e as validações sejam aplicadas corretamente.

    const onSubmit = (data) => {
        console.log("Dados do funcionário:", data);
    };

    return (
        
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ backgroundColor: '#ADD8E6', padding: 2, borderRadius: 1, mt: 2 }}>

            <Toolbar sx={{ backgroundColor: '#ADD8E6', padding: 1, borderRadius: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" color="primary">Dados Funcionário</Typography>
            </Toolbar>

            <Box sx={{ backgroundColor: 'white', padding: 2, borderRadius: 3, mb: 2 }}>

                <TextField
                    label="Nome" fullWidth margin="normal"
                    {...register('nome', { required: 'Nome é obrigatório' })} error={!!errors.nome} helperText={errors.nome?.message}
                />
                {/* CPF com máscara */}
                <Controller
                    name="cpf" control={control} defaultValue="" rules={{ required: 'CPF é obrigatório' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="CPF" fullWidth margin="normal"
                            error={!!errors.cpf} helperText={errors.cpf?.message}
                            InputProps={{
                                // Define o IMaskInputWrapper como o componente de entrada
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "000.000.000-00",
                                    // O regex [0-9] aceita apenas números de 0 a 9
                                    definitions: {
                                        "0": /[0-9]/,
                                    },
                                    // Retorna apenas os números no valor
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />
                <TextField
                    label="Matrícula" fullWidth margin="normal"
                    {...register('matricula', { required: 'Matrícula é obrigatória' })} error={!!errors.matricula} helperText={errors.matricula?.message}
                />
                {/* Telefone com máscara */}
                <Controller
                    name="telefone" control={control} defaultValue="" rules={{ required: 'Telefone é obrigatório' }}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label="Telefone" fullWidth margin="normal"
                            error={!!errors.telefone} helperText={errors.telefone?.message}
                            InputProps={{
                                // Define o IMaskInputWrapper como o componente de entrada
                                inputComponent: IMaskInputWrapper,
                                inputProps: {
                                    mask: "(00) 00000-0000",
                                    // O regex [0-9] aceita apenas números de 0 a 9
                                    definitions: {
                                        "0": /[0-9]/,
                                    },
                                    // Retorna apenas os números no valor
                                    unmask: true,
                                },
                            }}
                        />
                    )}
                />
                <TextField
                    label="Senha" type="password" fullWidth margin="normal"
                    {...register('senha', { required: 'Senha é obrigatória', minLength: { value: 6, message: 'Senha deve ter pelo menos 6 caracteres' } })}
                    error={!!errors.senha} helperText={errors.senha?.message}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="grupo-label">Grupo</InputLabel>
                    <Select
                        labelId="grupo-label"
                        label="Grupo"
                        onChange={(e) => setGrupo(e.target.value)}
                        {...register('grupo')}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="gerente">Gerente</MenuItem>
                        <MenuItem value="funcionario">Funcionário</MenuItem>
                    </Select>
                </FormControl>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button sx={{ mr: 1 }}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained">
                        Cadastrar
                    </Button>
                </Box>

            </Box>

        </Box>
    );
};

export default FuncionarioForm;