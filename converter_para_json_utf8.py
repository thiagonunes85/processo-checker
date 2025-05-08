import pandas as pd
import json

arquivo_csv = 'dados.csv'
arquivo_json = 'dados.json'

# Tenta abrir com separador correto
try:
    df = pd.read_csv(arquivo_csv, sep=';', encoding='utf-8')
except UnicodeDecodeError:
    df = pd.read_csv(arquivo_csv, sep=';', encoding='latin1')

# Limpa colunas e renomeia para o frontend
df.columns = df.columns.str.strip().str.replace('\ufeff', '', regex=False)

df.rename(columns={
    'NUM_PROCESSO': 'Número do Processo',
    'NOME_REQUERENTE_INICIAIS': 'Nome',
    'CPF_REQUERENTE_ANONIMIZADO': 'CPF',
    'STATUS_PROCESSO': 'Status'
}, inplace=True)

colunas_necessarias = ['Nome', 'CPF', 'Número do Processo', 'Status']
for col in colunas_necessarias:
    if col not in df.columns:
        print("Colunas reais:", df.columns.tolist())
        raise Exception(f"A coluna obrigatória '{col}' não foi encontrada!")

dados = df[colunas_necessarias].to_dict(orient='records')

with open(arquivo_json, 'w', encoding='utf-8') as f:
    json.dump(dados, f, ensure_ascii=False, indent=2)

print(f"✅ JSON gerado com sucesso: '{arquivo_json}' ({len(dados)} registros)")
