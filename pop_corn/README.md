# 📊 Relatórios Semanais do Projeto "Pop&Corn"

## 🗓️ Período: 27/06 a 03/07

### ✅ Atividades Realizadas
- Reuniões iniciais para definição do escopo e funcionalidades do projeto **Pop Corn**.
- Elaboração da proposta do projeto, com definição dos módulos principais:
  - Autenticação
  - Listagem de filmes
  - Consulta de programação
  - Compra de ingressos
  - Escolha de assento
  - Compra de combos e bomboniere

- Configuração do ambiente de desenvolvimento com **Angular**.
- Organização inicial da arquitetura do projeto:
  - Estrutura de pastas criada em `src/app`

### 📌 Resultados
- Ambiente de desenvolvimento configurado com sucesso.


---

## 🗓️ Período: 04/07 a 10/07

### ✅ Atividades Realizadas
- Início da implementação dos componentes relacionados a filmes.
- Criação dos componetes de autenticação, lista de filmes e card

### 📌 Resultados
- Componentes `movie-card` e `movie-list` criados e com implementação inicial.
- Tela de listagem de filmes em desenvolvimento.

---

## 🗓️ Período: 11/07 a 25/07

### ✅ Atividades Realizadas

**Refatoração da Arquitetura Principal (Nelson & Sabrina):**
- Implementação de uma arquitetura de serviços reativa:
  - Uso de Signals para gestão de estado.
  - Services para lógica de dados.
  - Providers para injeção de dependência flexível, permitindo alternar entre dados mock e API real.
- Configuração dos ambientes de desenvolvimento e produção.

**Desenvolvimento do Layout e Navegação (Nelson):**
- Criação da sidebar de navegação retrátil.
- Desenvolvimento do layout principal da aplicação, agora utilizado como base para todas as telas.

**Finalização da Tela de Listagem de Filmes (Sabrina):**
- Conclusão da tela `movie-list`, com exibição dinâmica da lista de filmes utilizando o novo serviço de dados.

**Desenvolvimento da Página de Detalhes do Filme (Nelson):**
- Página totalmente dinâmica, com busca de dados do filme selecionado.
- Exibição da sinopse, nota em estrelas e lista de cinemas e sessões disponíveis.

**Criação da Tela de Reserva e Compra de Ingressos (Nelson):**
- Implementação de modelos e serviços para cinemas, salas e sessões.
- Criação da tela de reserva (Booking), incluindo:
  - Seleção de tipo e quantidade de ingressos.
  - Base funcional para futura seleção de assentos.

### 📌 Resultados
- Refatoração da arquitetura concluída.
- Layout principal e navegação integrados.
- Tela de listagem de filmes finalizada.
- Página de detalhes e tela de reserva funcionando com dados mockados.

### ⚠️ Pontos de Atenção
- O desenvolvimento das semanas anteriores sofreu atrasos devido às defesas de TCC dos membros Nelson Thiago e Sabrina Frazão, realizadas entre os dias 14/07 e 15/07.
- As atividades do projeto foram retomadas com força total após essas datas.

### 📝 Avaliação de Layout e Planejamento
Essa semana o projeto passou por uma sessão de avaliação conduzida pelo Professor Luiz Bentes e Juliana. O feedback recebido foi essencial para identificar pontos de melhoria e reestruturar prioridades de desenvolvimento.
Como resultado, foi definido o seguinte plano de ação:

---

### Diretrizes de UI/UX e Melhorias Imediatas:

#### Layout e Visual
- [ ] Exibir o título da página em todas as telas.
- [ ] Substituir a fonte por uma mais adequada à web (sugestão: Roboto).
- [ ] Garantir consistência visual entre todas as páginas.
- [ ] Posicionar o logotipo da aplicação na barra lateral.
- [ ] Incluir botões de "retornar" nos fluxos com múltiplas etapas.
- [ ] Definir e aplicar uma paleta de cores e identidade visual consistentes.

#### Componentes

**Card de filmes**
- [ ] Limitar a quantidade de texto exibido.
- [ ] Fixar a posição dos elementos.
- [ ] Garantir visibilidade total do título.
- [ ] Permitir que o gênero seja exibido parcialmente.
- [ ] Adicionar filtro de filmes por cinema.

**Seleção de assentos**
- [ ] Aumentar o contraste para destacar os assentos selecionados.
- [ ] Incluir uma legenda clara.
- [ ] Exibir informações do filme e horário de forma persistente.

#### Alertas e Mensagens
- [ ] Implementar alertas de confirmação para ações importantes (como compra e cancelamento).
- [ ] Padronizar o estilo das mensagens (adotar toast ou modal unificado).

---

### 🧩 Escopo de Novas Funcionalidades:

#### Autenticação e Usuário
- [ ] Implementar as telas de login, cadastro e perfil de usuário.
- [ ] Desenvolver o controle de estado de autenticação.

#### Fluxo de Compra
- [ ] Desenvolver a seção da bomboniere (catálogo e carrinho).
- [ ] Implementar a finalização do pedido.
- [ ] Criar a visualização de pedidos pendentes.
- [ ] Garantir persistência dos dados durante o fluxo (filme, horário, assentos, bomboniere).

---

### 🎬 Requisitos do Administrativo:

#### Gestão de Cinemas e Sessões
- [ ] Implementar o CRUD de cinemas, salas e sessões.

#### Gestão de Filmes
- [ ] Desenvolver o CRUD de filmes e seus metadados (título, sinopse, imagem, etc.).

---

### 🎨 Ações de Design e Planejamento (Figma):
- [ ] Criar os designs das telas restantes.
- [ ] Revisar os designs existentes com base no feedback.
- [ ] Documentar e delimitar o escopo do MVP (Minimum Viable Product).

---

## 🗓️ Período: 25/07 a 31/07

### ✅ Atividades Realizadas

**Implementação do Fluxo Completo de Compra (Nelson):**

* Criação de novas telas:

  * **Bomboniere**: seleção de alimentos e bebidas.
  * **Pagamento**: resumo do pedido, CPF, QR Code e opção de PIX.
  * **Histórico de Pedidos**: visualização de pedidos anteriores.
* Implementação do módulo `Order` para gerenciamento centralizado de estado do pedido (ingressos, lugares e produtos), com persistência via `localStorage`.

**Componentes e Serviços Criados:**

* `order.service.ts` e `finalized-order.model.ts` no módulo `order`.
* `bomboniere.component`, `product-card`, `bomboniere.service.ts` e `bomboniere.model.ts`.
* `payment.component` e `order-history.component`.

**Atualizações em Componentes Existentes:**

* **Rotas** adicionadas para as novas páginas (`/bomboniere`, `/payment`, `/meus-pedidos`).
* **movie-details**: nova paleta de cores e botão de retorno.
* **booking**:

  * Novo fluxo de seleção (escolha de lugares antes dos ingressos).
  * Integração com o `OrderService`.
  * Ajustes visuais e na UX.
* **sidebar**:

  * Redesenho visual.
  * Substituição do link "Dados de Pagamento" por "Meus Pedidos".
  * Sidebar responsiva com botão de menu.
* `styles.scss`: importação e aplicação da fonte **Roboto** globalmente.

**Ajustes Visuais e Feedback (Sabrina):**

* Aplicadas as alterações solicitadas pela Juliana referentes ao layout geral.
* Finalização do componente e visual da barra de **pesquisa de filmes** com foco em clareza e consistência visual.

**Fluxo de Autenticação (Dimerson):**

* Desenvolvimento das telas e fluxos de **cadastro** e **login**, incluindo o layout e a integração inicial com o controle de estado de usuário.

### 📌 Resultados

* Novo fluxo completo de compra implementado.
* Telas de bomboniere, pagamento e histórico funcionais e integradas.
* Componentes visuais refinados com nova identidade visual.
* Aplicação mais responsiva e visualmente coesa.

---

### 👥 Equipe

- Dimerson Coelho
- Nelson Thiago
- Sabrina Frazão
