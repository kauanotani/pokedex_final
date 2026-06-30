# Pokedex Interativa

## Descrição do Projeto

A **Pokedex Interativa** é um aplicativo móvel desenvolvido em **React Native** com **Expo**, que permite listar Pokémons, visualizar seus detalhes e salvar favoritos em um banco de dados na nuvem.

## Funcionalidades

- Listagem de Pokémons
- Visualização dos detalhes de cada Pokémon
- Adição de Pokémons aos favoritos
- Listagem dos Pokémons favoritos
- Edição de apelido dos favoritos
- Exclusão de Pokémons favoritos
- Navegação entre telas
- Animação na tela de detalhes do Pokémon

## API Utilizada

O projeto consome dados da **PokeAPI**, uma API pública e gratuita que fornece informações sobre Pokémons.

Link da API:

```
https://pokeapi.co/
```

## CRUD com Firebase

O projeto implementa as quatro operações básicas de um CRUD:

| Operação | Descrição |
|---|---|
| Create | Adicionar um Pokémon aos favoritos |
| Read | Listar os Pokémons favoritos |
| Update | Editar o apelido de um Pokémon favorito |
| Delete | Remover um Pokémon dos favoritos |

## Tecnologias Utilizadas

- React Native
- Expo
- JavaScript
- Firebase Firestore
- React Navigation
- PokeAPI
- Animated API do React Native

## Navegação

O projeto utiliza a biblioteca **React Navigation** para realizar a navegação entre as telas.

Telas principais do aplicativo:

- Home
- Lista de Pokémons
- Detalhes do Pokémon
- Favoritos

## Animação

O aplicativo possui animação na tela de detalhes do Pokémon, utilizando a API `Animated` do React Native. A animação é aplicada na imagem do Pokémon, deixando a interface mais dinâmica e agradável para o usuário.

## Como Rodar o Projeto

Antes de começar, é necessário ter instalado:

- Node.js
- npm
- Expo Go no celular

Depois de baixar ou clonar o projeto, acesse a pasta do projeto pelo terminal:

```bash
cd pokedex-final
```

Instale as dependências:

```bash
npm install
```

Inicie o projeto:

```bash
npm start
```

Após iniciar o Expo, escaneie o QR Code com o aplicativo **Expo Go** no celular.


## Vídeo de Apresentação

Link do vídeo demonstrando o funcionamento do aplicativo:

[Assista ao vídeo no YouTube](https://youtu.be/bUOBAygqKrY)

## Autores 

Projeto desenvolvido por **Henrick Borba** e **Kauan Otani**.