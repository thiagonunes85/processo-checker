import pandas as pd
import json

# Caminhos dos arquivos
arquivo_csv = 'dados.csv'
arquivo_json = 'dados.json'

# Lê o CSV com encoding compatível com Windows + Excel
df = pd.read_csv(arquivo_csv, encoding='latin1')

# Limpa nomes das colunas
df.columns = df.columns.str.strip()

# Renomeia colunas para padronizar com o frontend
df = df.rename(columns={
    'CPF_REQUERENTE_ANONIMIZADO': 'CPF',
    'NUM_PROCESSO': 'Número do Processo',
    'STATUS_PROCESSO': 'Status'
})

# Seleciona apenas as colunas necessárias
colunas_necessarias = ['CPF', 'Número do Processo', 'Status']
for col in colunas_necessarias:
    if col not in df.columns:
        raise Exception(f"A coluna obrigatória '{col}' não foi encontrada!")

dados = df[colunas_necessarias].to_dict(orient='records')

with open(arquivo_json, 'w', encoding='utf-8') as f:
    json.dump(dados, f, ensure_ascii=False, indent=2)

print(f'✅ JSON gerado com sucesso: "{arquivo_json}" ({len(dados)} registros)')
