# IESPFLIX

Clone visual educacional inspirado em interfaces de streaming, com identidade própria **IESPFLIX**.

## Stack

- **Front-end:** React + Vite + CSS puro
- **Back-end:** Node.js + Express
- **Dados:** TMDB API (imagens reais, backdrops, sinopses)

## Estrutura

```
iespflix/
├── front-end/     → React + Vite (porta 5173)
├── back-end/      → Express API (porta 3001)
└── package.json   → Scripts raiz
```

## Setup

1. Configure sua chave TMDB em `back-end/.env`:

```env
PORT=3001
TMDB_API_KEY=sua_chave_aqui
```

2. Instale dependências e rode:

```bash
npm install
npm run install-all
npm run dev
```

3. Acesse: [http://localhost:5173](http://localhost:5173)

## Funcionalidades

- Header fixo com blur e navegação
- Carrossel automático com backdrops reais do TMDB
- Filtro funcional por gênero (Filmes e Séries)
- Top 10 com ranking visual
- Dropdown de perfis e notificações
- Cache em memória (30min) no back-end
- Páginas: Início, Filmes, Séries, Bombando, Minha lista, Idiomas
- Design responsivo
