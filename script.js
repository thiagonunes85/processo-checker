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
  const legendaDiv = document.getElementById('legenda-status');

  resultadoDiv.innerHTML = '';
  legendaDiv.style.display = 'none';

  if (!entrada || entrada.length < 3) {
    resultadoDiv.textContent = 'Por favor, insira pelo menos 3 caracteres.';
    return;
  }

  const entradaNumeros = entrada.replace(/\D/g, '');
  const entradaTexto = normalizarTexto(entrada);

  let fatiaCpfEntrada = '';
  if (entradaNumeros.length >= 9) {
    fatiaCpfEntrada = entradaNumeros.slice(3, 9); // posição 4 a 9
  } else if (entradaNumeros.length === 6) {
    fatiaCpfEntrada = entradaNumeros;
  }

  if (entradaNumeros.length >= 11) {
    const aviso = document.createElement('p');
    aviso.style.color = '#666';
    aviso.style.fontSize = '13px';
    aviso.style.margin = '10px 0';
    aviso.innerHTML = `
      🔐 Detectamos que você digitou o CPF completo. Por segurança, <strong>apenas os dígitos de posição 4 a 9</strong> são usados na busca.<br>
      Nenhum dado digitado é armazenado. O código é aberto e está em conformidade com a legislação vigente.
    `;
    resultadoDiv.appendChild(aviso);
  }

  const resultados = dados.filter(item => {
    const matchCPF = item.CPF.match(/\d{3}\.\d{3}/); // extrai 685.471
    const faixaCpf = matchCPF ? matchCPF[0].replace(/\D/g, '') : ''; // → 685471
    const processoNormalizado = normalizarTexto(item['Número do Processo']);

    const cpfMatch = fatiaCpfEntrada === faixaCpf;
    const processoMatch = processoNormalizado.includes(entradaTexto);

    return cpfMatch || processoMatch;
  });

  if (resultados.length) {
    resultados.forEach(item => {
      const div = document.createElement('div');
      div.innerHTML = `
        <strong>Nome:</strong> ${item.Nome}<br>
        <strong>CPF:</strong> ${item.CPF}<br>
        <strong>Nº Processo SEI:</strong> ${item['Número do Processo']}<br>
        <strong>Status:</strong> ${item.Status}<br><hr>
      `;
      resultadoDiv.appendChild(div);
    });

    // Mostrar legenda dos status
    legendaDiv.style.display = 'block';
  } else {
    const avisoErro = document.createElement('p');
    avisoErro.textContent = 'Nenhum processo encontrado com os dados informados.';
    resultadoDiv.appendChild(avisoErro);
  }
}

function copiarPix() {
  const chave = document.getElementById("chavePix").textContent;
  navigator.clipboard.writeText(chave).then(() => {
    const aviso = document.getElementById("aviso-copiado");
    aviso.style.display = 'inline';
    setTimeout(() => {
      aviso.style.display = 'none';
    }, 3000);
  }).catch(err => {
    alert('Não foi possível copiar a chave Pix. Copie manualmente.');
    console.error('Erro ao copiar:', err);
  });
}
