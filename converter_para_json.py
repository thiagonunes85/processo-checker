import pandas as pd
import json

arquivo_csv = 'dados.csv'
arquivo_json = 'dados.json'

df = pd.read_csv(arquivo_csv, encoding='latin1')
df.columns = df.columns.str.strip()

df = df.rename(columns={
    'CPF_REQUERENTE_ANONIMIZADO': 'CPF',
    'NUM_PROCESSO': 'Número do Processo',
    'STATUS_PROCESSO': 'Status',
    'NOME_REQUERENTE_INICIAIS': 'Nome'
})

colunas_necessarias = ['Nome', 'CPF', 'Número do Processo', 'Status']
for col in colunas_necessarias:
    if col not in df.columns:
        raise Exception(f"A coluna obrigatória '{col}' não foi encontrada!")

dados = df[colunas_necessarias].to_dict(orient='records')

with open(arquivo_json, 'w', encoding='utf-8') as f:
    json.dump(dados, f, ensure_ascii=False, indent=2)

print(f'✅ JSON gerado com sucesso: \"{arquivo_json}\" ({len(dados)} registros)')