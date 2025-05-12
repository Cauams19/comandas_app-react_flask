from flask import Blueprint, jsonify, request
from settings import API_ENDPOINT_FUNCIONARIO
from funcoes import Funcoes

bp_funcionario = Blueprint('funcionario', __name__, url_prefix="/api/funcionario")

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