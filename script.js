let dados = [];

// Carrega o JSON
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

  if (!entrada || entrada.length < 4) {
    resultadoDiv.textContent = 'Por favor, insira ao menos 4 caracteres.';
    return;
  }

  const entradaNormalizada = normalizarTexto(entrada);

  const resultados = dados.filter(item => {
    const cpfNumeros = item.CPF.replace(/[^\d]/g, '');
    const cpfVisivel = cpfNumeros.slice(3, 9); // posições 4 a 9
    const processoNormalizado = normalizarTexto(item['Número do Processo']);

    return cpfVisivel === entradaNormalizada || processoNormalizado.includes(entradaNormalizada);
  });

  if (resultados.length) {
    resultados.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>CPF:</strong> ${item.CPF}<br>
        <strong>Nº Processo:</strong> ${item['Número do Processo']}<br>
        <strong>Status:</strong> ${item.Status}<br><hr>
      `;
      resultadoDiv.appendChild(div);
    });
  } else {
    resultadoDiv.textContent = 'Nenhum processo encontrado com os dados informados.';
  }
}
