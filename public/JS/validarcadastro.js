function validarcadastro() {
    const nomeInput = document.getElementById('nome').value.trim();
    const emailInput = document.getElementById('email').value.trim();
    const senhaInput = document.getElementById('senha').value.trim();
    const telefoneInput = document.getElementById('telefone').value.trim();
    const generoRadios = document.querySelectorAll('input[name="genero"]');
    const mensagemUsuario = document.getElementById('mensagem-usuario');

    // limpa mensagem anterior
  mensagemDiv.textContent = '';
  mensagemDiv.style.color = '';

  if (!nome || !email || !senha) {
    mensagemDiv.style.color = 'red';
    mensagemDiv.textContent = 'Por favor preencha nome, e-mail e senha.';
    return false;
  }

  // validação simples de e-mail (se já tem validar-email.js você pode removê-la daqui)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    mensagemDiv.style.color = 'red';
    mensagemDiv.textContent = 'E-mail inválido.';
    return false;
  }

  // tudo ok -> permite envio
  return true;
}

// também exibe mensagens passadas pela query string (ex: ?erro=email_duplicado)
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const msg = document.getElementById('mensagem-usuario');
  if (!msg) return;

  if (params.has('erro')) {
    const erro = params.get('erro');
    const map = {
      'email_duplicado': 'Este e-mail já está cadastrado.',
      'campos_vazios': 'Por favor preencha todos os campos.',
      'erro_servidor': 'Erro no servidor. Tente mais tarde.'
    };
    msg.style.color = 'red';
    msg.textContent = map[erro] || 'Erro desconhecido.';
  } else if (params.has('sucesso')) {
    const s = params.get('sucesso');
    if (s === 'cadastrado') {
      msg.style.color = 'green';
      msg.textContent = 'Cadastro realizado com sucesso! Faça login.';
    }
  }
});