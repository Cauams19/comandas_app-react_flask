from flask import Blueprint, request, jsonify, session
from settings import (
    LOGIN_LOCAL_USERNAME, LOGIN_LOCAL_PASSWORD, LOGIN_LOCAL_GRUPO,
    API_ENDPOINT_FUNCIONARIO
)
import requests

bp_auth = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp_auth.post('/login')
def login():
    data = request.json
    usuario = data.get('usuario')
    senha = data.get('senha')

    if not usuario or not senha:
        return jsonify({"erro": "Usuário e senha são obrigatórios"}), 400

    if usuario.startswith('@'):
        # Login local
        usuario_limpado = usuario[1:]
        if usuario_limpado == LOGIN_LOCAL_USERNAME and senha == LOGIN_LOCAL_PASSWORD:
            session['usuario'] = usuario_limpado
            session['grupo'] = LOGIN_LOCAL_GRUPO
            return jsonify({"usuario": usuario_limpado, "grupo": LOGIN_LOCAL_GRUPO}), 200
        return jsonify({"erro": "Usuário local inválido"}), 401
    
    # Login via API (CPF + senha)
    try:
        response = requests.post(f"{API_ENDPOINT_FUNCIONARIO}login/", json={"cpf": usuario, "senha": senha}, verify=False)
        
        if response.status_code == 200:
            funcionario = response.json()
            session['usuario'] = funcionario['nome']
            session['grupo'] = funcionario['grupo']
            return jsonify({"usuario": funcionario['nome'], "grupo": funcionario['grupo']}), 200

        return jsonify(response.json()), 401

    except Exception as e:
        return jsonify({"erro": str(e)}), 500
