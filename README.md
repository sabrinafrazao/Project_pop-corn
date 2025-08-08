# Projeto Pop&Corn 🍿

Bem-vindo ao Pop&Corn, um sistema completo de venda de ingressos de cinema. Este projeto é um monorepo que contém duas aplicações principais:

* **`backend/`**: Uma API RESTful construída com FastAPI (Python) que gere toda a lógica de negócio, incluindo utilizadores, filmes, cinemas, sessões e pedidos.
* **`frontend/`**: Uma aplicação Single-Page Application (SPA) construída com Angular, que consome a API para fornecer uma interface de utilizador rica e interativa.

---

## Pré-requisitos

Antes de começar, certifique-se de que tem as seguintes ferramentas instaladas na sua máquina:

* **Node.js e npm**: [Descarregar Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
* **Python**: [Descarregar Python](https://www.python.org/downloads/) (versão 3.10 ou superior recomendada)
* **Angular CLI**: Após instalar o Node.js, instale o Angular CLI globalmente com o comando:
  ```bash
  npm install -g @angular/cli
  ```

---

## Como Rodar o Projeto

Para rodar a aplicação completa, você precisará de **dois terminais abertos** em simultâneo: um para o backend e outro para o frontend.

### 1. Configurar e Rodar o Backend (API)

Siga estes passos no seu **primeiro terminal**:

1. **Navegue para a pasta do backend:**

   ```bash
   cd app
   ```
2. **Crie e ative um ambiente virtual:**

   ```bash
   # Criar o ambiente (só precisa de fazer isto uma vez)
   python -m venv venv

   # Ativar o ambiente (precisa de fazer isto sempre que abrir um novo terminal)
   # No Windows (PowerShell):
   .\venv\Scripts\activate
   # No macOS/Linux:
   source venv/bin/activate
   ```
3. **Instale as dependências Python:**

   ```bash
   pip install -r requirements.txt
   ```
4. **Popule a base de dados:** Execute o script `seed.py` para criar as tabelas e inserir os dados iniciais de filmes, utilizadores e cinemas.

   ```bash
   python seed.py
   ```
5. **Inicie o servidor da API:**

   ```bash
   uvicorn app.main:app --reload
   ```

✅ **Sucesso!** O seu backend estará a rodar em `http://localhost:8000`.

---

### 2. Configurar e Rodar o Frontend (Angular)

Siga estes passos no seu **segundo terminal**:

1. **Navegue para a pasta do frontend:**

   ```bash
   cd pop_corn
   ```
2. **Instale as dependências do Node.js:**

   ```bash
   npm install
   ```
3. **Verifique a configuração do ambiente:** Abra o ficheiro `frontend/src/environment/environment.ts` e certifique-se de que a `useMockService` está definida como `false` para que a aplicação comunique com a sua API real.

   ```typescript
   export const environment = {
       production: false,
       useMockService: false,
       apiUrl: 'http://localhost:8000/api'
   }
   ```
4. **Inicie o servidor de desenvolvimento do Angular:**

   ```bash
   ng serve
   ```

✅ **Sucesso!** A sua aplicação frontend estará disponível no seu navegador em `http://localhost:4200/`.
