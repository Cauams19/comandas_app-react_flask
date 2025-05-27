from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_FUNCIONARIO
from funcoes import Funcoes
import bcrypt

bp_funcionario = Blueprint('funcionario', __name__, url_prefix="/api/funcionario")

def gerar_hash_senha(senha):
    # Gera um hash bcrypt para a senha
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(senha.encode('utf-8'), salt).decode('utf-8')

def is_hash_valido(senha):
    # Verifica se a senha já está hasheada
    return (isinstance(senha, str) and 
            senha.startswith(('$2a$', '$2b$', '$2y$')) and
            len(senha) == 60)

# --- Rotas da API do Backend (que serão consumidas pelo React) ---

# Rota para Listar todos os Funcionários (READ - All)
@bp_funcionario.route('/all', methods=['GET'])
def get_funcionarios():
    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('get', API_ENDPOINT_FUNCIONARIO)
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Obter um Funcionário Específico (READ - One)
@bp_funcionario.route('/one', methods=['GET'])
def get_funcionario():
    # obtém o ID do funcionário a partir dos parâmetros de consulta da URL
    id_funcionario = request.args.get('id_funcionario')
    # valida se o id_funcionario foi passado na URL
    if not id_funcionario:
        return jsonify({"error": "O parâmetro 'id_funcionario' é obrigatório"}), 400
    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_FUNCIONARIO}{id_funcionario}")
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Criar um novo Funcionário (POST)
@bp_funcionario.route('/', methods=['POST'])
def create_funcionario():
    # verifica se o conteúdo da requisição é JSON
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    # obtém o corpo da requisição JSON
    data = request.get_json()
    # validação básica para ver se os campos foram informados no json
    required_fields = ['nome', 'matricula', 'cpf', 'senha', 'grupo', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400
    
    # Hash da senha antes de enviar para a API
    if not is_hash_valido(data['senha']):
        data['senha'] = gerar_hash_senha(data['senha'])

    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('post', API_ENDPOINT_FUNCIONARIO, data=data)
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Atualizar um Funcionário existente (PUT)
@bp_funcionario.route('/', methods=['PUT'])
def update_funcionario():
    # verifica se o conteúdo da requisição é JSON
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    # obtém o corpo da requisição JSON
    data = request.get_json()
    # validação básica para ver se os campos foram informados no json
    required_fields = ['id_funcionario', 'nome', 'matricula', 'cpf', 'senha', 'grupo', 'telefone']
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400
    
    # Se a senha foi enviada e não está hasheada, cria o hash
    if 'senha' in data and data['senha'] and not is_hash_valido(data['senha']):
        data['senha'] = gerar_hash_senha(data['senha'])

    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('put', f"{API_ENDPOINT_FUNCIONARIO}{data.get('id_funcionario')}", data=data)
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Deletar um Funcionário (DELETE)
@bp_funcionario.route('/', methods=['DELETE'])
def delete_funcionario():
    # obtém o ID do funcionário a partir dos parâmetros de consulta da URL
    id_funcionario = request.args.get('id_funcionario')
    # valida se o id_funcionario foi passado na URL
    if not id_funcionario:
        return jsonify({"error": "O parâmetro 'id_funcionario' é obrigatório"}), 400
    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('delete', f"{API_ENDPOINT_FUNCIONARIO}{id_funcionario}")
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Validar se CPF já existe (GET)
@bp_funcionario.route('/cpf', methods=['GET'])
def validate_cpf():
    # obtém o CPF a partir dos parâmetros de consulta da URL
    cpf = request.args.get('cpf')
    # valida se o CPF foi passado na URL
    if not cpf:
        return jsonify({"error": "O parâmetro 'cpf' é obrigatório"}), 400
    # chama a função para fazer a requisição à API externa
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_FUNCIONARIO}cpf/{cpf}")
    # retorna o json da resposta da API externa
    return jsonify(response_data), status_code

# Rota para Validar o Login (POST)
@bp_funcionario.route('/login', methods=['POST'])
def validar_login():
    if not request.is_json:
        return jsonify({"error": "Requisição deve ser JSON"}), 400
    
    data = request.get_json()
    required_fields = ['cpf', 'senha']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": f"Campos obrigatórios faltando: {required_fields}"}), 400
    
    # Primeiro obtém o hash da senha do usuário
    response_data, status_code = Funcoes.make_api_request('get', f"{API_ENDPOINT_FUNCIONARIO}cpf/{data['cpf']}")
    
    if status_code != 200 or not response_data:
        return jsonify({"error": "CPF ou senha inválidos"}), 401
    
    hash_senha = response_data[0]['senha']
    
    # Verifica se a senha corresponde ao hash
    if not bcrypt.checkpw(data['senha'].encode('utf-8'), hash_senha.encode('utf-8')):
        return jsonify({"error": "CPF ou senha inválidos"}), 401
    
    # Se chegou aqui, login é válido
    return jsonify({"success": True, "id_funcionario": response_data[0]['id_funcionario']}), 200