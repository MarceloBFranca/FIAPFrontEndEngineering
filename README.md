# Mesa (FrontEnd)

## a) Resumo da Aplicação

Este projeto é uma aplicação web front-end desenvolvida para a gestão de filas de restaurantes em tempo real. A plataforma permite que os usuários visualizem uma lista de restaurantes parceiros, verifiquem o status atual de suas filas e entrem na fila de espera de forma remota.

Uma vez na fila, o usuário pode acompanhar sua posição em tempo real, recebendo atualizações instantâneas sobre o andamento da fila, a senha que está sendo chamada e uma estimativa de tempo de espera. O sistema foi projetado para melhorar a experiência do cliente, reduzindo a necessidade de espera física e oferecendo maior conveniência.

### Funcionalidades Principais

* **Listagem de Restaurantes**: Exibe os restaurantes disponíveis com informações sobre o tamanho da fila atual.
* **Detalhes do Restaurante**: Mostra informações detalhadas sobre um restaurante, incluindo descrição, endereço e tempo de espera estimado.
* **Entrar e Sair da Fila**: Permite que os usuários entrem em uma fila de espera com um clique e saiam quando desejarem.
* **Visualização da Posição na Fila**: Uma tela dedicada mostra a posição atual do usuário, a senha que está sendo chamada e a estimativa de espera.
* **Atualizações em Tempo Real**: Utiliza WebSockets para garantir que todas as informações da fila sejam atualizadas instantaneamente, sem a necessidade de recarregar a página.

---

## b) Tecnologias Utilizadas

A aplicação foi construída utilizando um ecossistema moderno de desenvolvimento front-end. As principais tecnologias são:

* **Framework Principal**: **React** para a construção da interface de usuário.
* **Build Tool**: **Vite** para um desenvolvimento rápido e otimizado.
* **Roteamento**: **React Router DOM** para gerenciar a navegação entre as páginas.
* **Componentes de UI**: **React-Bootstrap** e **Bootstrap** para uma base de componentes estilizados e responsivos.
* **Comunicação em Tempo Real**: **Socket.IO Client** para a conexão com o servidor via WebSockets.
---

## c) Instruções para Rodar o Projeto Localmente

Para executar este projeto em sua máquina local, siga os passos abaixo.

### Pré-requisitos

1.  **Node.js**: É necessário ter o Node.js (versão 18 ou superior) instalado.
2.  **Servidor Back-end**: Esta é uma aplicação front-end que depende de um servidor back-end. Certifique-se de que o servidor correspondente esteja em execução na porta `3000` (`http://localhost:3000`), pois a aplicação fará requisições para este endereço.

### Passos para Instalação e Execução

1.  **Clone o Repositório**

    Abra seu terminal e clone o repositório para sua máquina local.

    ```bash
    git clone https://github.com/MarceloBFranca/FIAPFrontEndEngineering.git
    cd fiap-ativ-mesa-front
    ```

2.  **Instale as Dependências**

    Use o `npm` (ou `yarn`, se preferir) para instalar todas as dependências listadas no arquivo `package.json`.

    ```bash
    npm install
    ```

3.  **Rode o Servidor de Desenvolvimento**

    Execute o script `dev` para iniciar o servidor de desenvolvimento do Vite.

    ```bash
    npm run dev
    ```

4.  **Acesse a Aplicação**

    Após a execução do comando, o terminal mostrará o endereço local onde a aplicação está sendo executada, geralmente `http://localhost:5173`. Abra este endereço no seu navegador para visualizar o projeto.

Com isso, o ambiente de desenvolvimento estará pronto e a aplicação estará funcionando, conectada ao seu servidor back-end local.
