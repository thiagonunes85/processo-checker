let dados = [];

fetch('dados.json')
  .then(res => res.json())
  .then(json => {
    dados = json;
  })
  .catch(() => alert('Erro ao carregar os dados.'));

function normalizarTexto(texto) {
  return texto.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function buscar() {
  const entrada = document.getElementById('entrada').value.trim();
  const resultadoDiv = document.getElementById('resultado');
  resultadoDiv.innerHTML = '';

  if (!entrada || entrada.length < 3) {
    resultadoDiv.textContent = 'Por favor, insira pelo menos 3 dígitos.';
    return;
  }

  const entradaNumeros = entrada.replace(/\D/g, '');

  if (entradaNumeros.length === 11) {
    const aviso = document.createElement('p');
    aviso.style.color = '#888';
    aviso.style.fontSize = '14px';
    aviso.style.marginTop = '10px';
    aviso.innerHTML = '🔐 Detectamos que você digitou o CPF completo. Por segurança, só usamos os dígitos de posição 4 a 9 na busca.';
    resultadoDiv.appendChild(aviso);
  }

  const resultados = dados.filter(item => {
    const cpfNumeros = item.CPF.replace(/\D/g, '');
    const faixaCpf = cpfNumeros.slice(3, 9);
    const processoNormalizado = normalizarTexto(item['Número do Processo']);

    const cpfMatch = faixaCpf.includes(entradaNumeros);
    const processoMatch = processoNormalizado.includes(normalizarTexto(entrada));

    return cpfMatch || processoMatch;
  });

  if (resultados.length) {
    resultados.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>Nome:</strong> ${item.Nome}<br>
        <strong>CPF:</strong> ${item.CPF}<br>
        <strong>Nº Processo:</strong> ${item['Número do Processo']}<br>
        <strong>Status:</strong> ${item.Status}<br><hr>
      `;
      resultadoDiv.appendChild(div);
    });
  } else {
    const avisoErro = document.createElement('p');
    avisoErro.textContent = 'Nenhum processo encontrado com os dados informados.';
    resultadoDiv.appendChild(avisoErro);
  }
}
