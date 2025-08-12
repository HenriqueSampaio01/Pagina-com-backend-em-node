// validação simples do formulário de login
function validarlogin() {
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();
  const mensagemDiv = document.getElementById('mensagem-usuario');

  mensagemDiv.textContent = '';
  mensagemDiv.style.color = '';

  if (!email || !senha) {
    mensagemDiv.style.color = 'red';
    mensagemDiv.textContent = 'Preencha e-mail e senha.';
    return false;
  }

  // validação simples de e-mail
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    mensagemDiv.style.color = 'red';
    mensagemDiv.textContent = 'E-mail inválido.';
    return false;
  }

  return true; // envia para /login
}

// mostra mensagens vindas do servidor via query string
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const msg = document.getElementById('mensagem-usuario');
  if (!msg) return;

  if (params.has('erro')) {
    const erro = params.get('erro');
    const map = {
      'campos_vazios': 'Por favor preencha e-mail e senha.',
      'usuario_nao_encontrado': 'Usuário não encontrado.',
      'senha_incorreta': 'Senha incorreta.',
      'erro_servidor': 'Erro no servidor. Tente novamente.'
    };
    msg.style.color = 'red';
    msg.textContent = map[erro] || 'Erro desconhecido.';
  } else if (params.has('sucesso')) {
    const s = params.get('sucesso');
    if (s === 'cadastrado') {
      msg.style.color = 'green';
      msg.textContent = 'Cadastro realizado com sucesso! Faça login.';
    }
    // você pode mapear outros sucessos se quiser
  }
});