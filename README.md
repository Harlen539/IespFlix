# 🎬 IespFlix

IespFlix é uma aplicação acadêmica inspirada em plataformas de streaming, desenvolvida com arquitetura separada entre **back-end** e **front-end**.

O projeto possui uma API REST construída com **Spring Boot** e uma interface web desenvolvida com **React + Vite**, permitindo a listagem e consumo de conteúdos como filmes e séries.

---

## 📌 Sobre o Projeto

O objetivo do IespFlix é simular uma plataforma de streaming, trabalhando conceitos importantes de desenvolvimento web, como:

- Separação entre front-end e back-end;
- Consumo de API REST;
- Organização de rotas;
- Integração com serviços externos;
- Persistência de dados;
- Validação de dados;
- Documentação de API com Swagger;
- Desenvolvimento de interface moderna com React.

---

## 🧱 Estrutura do Projeto

```bash
IespFlix/
├── LICENSE
└── tecback-master/
    ├── back-end/
    │   ├── src/
    │   ├── pom.xml
    │   ├── mvnw.cmd
    │   └── README.md
    │
    └── front-end/
        ├── public/
        ├── src/
        ├── index.html
        ├── package.json
        ├── package-lock.json
        └── vite.config.js
````

---

## 🚀 Tecnologias Utilizadas

### Back-end

* Java 21
* Spring Boot 3.5.x
* Spring Web
* Spring Data JPA
* Spring Validation
* Spring Security
* Spring Cloud OpenFeign
* Springdoc OpenAPI / Swagger
* H2 Database
* ModelMapper
* Lombok
* Maven

### Front-end

* React 18
* Vite
* JavaScript
* Axios
* React Router DOM
* HTML5
* CSS3

---

## ⚙️ Pré-requisitos

Antes de rodar o projeto, tenha instalado em sua máquina:

* Java 21 ou superior
* Node.js
* npm
* Maven, opcional, pois o projeto também possui `mvnw.cmd`
* Git

---

## 📥 Como Clonar o Projeto

```bash
git clone https://github.com/Harlen539/IespFlix.git
```

Depois, entre na pasta do projeto:

```bash
cd IespFlix/tecback-master
```

---

## 🖥️ Como Rodar o Back-end

Entre na pasta do back-end:

```bash
cd back-end
```

Execute o projeto com Maven:

```bash
mvn spring-boot:run
```

Ou, no Windows, usando o Maven Wrapper:

```bash
.\mvnw.cmd spring-boot:run
```

A API ficará disponível em:

```bash
http://localhost:8080
```

---

## 🌐 Como Rodar o Front-end

Em outro terminal, entre na pasta do front-end:

```bash
cd front-end
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

O front-end ficará disponível em:

```bash
http://localhost:5175
```

---

## 🔗 Comunicação entre Front-end e Back-end

O front-end utiliza um proxy configurado no Vite para consumir a API do back-end.

Configuração usada:

```js
server: {
  port: 5175,
  proxy: {
    '/backend': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/backend/, ''),
    },
  },
}
```

Isso permite que o front-end faça requisições usando `/backend`, evitando problemas de CORS durante o desenvolvimento.

Exemplo:

```js
axios.get('/backend/api/v1/conteudos')
```

---

## 📚 Endpoints Principais da API

Alguns endpoints disponíveis no projeto:

```bash
GET /api/v1/conteudos
GET /api/v1/conteudos/top?n=5
GET /api/v1/conteudos/apos/{ano}
GET /api/v1/usuarios?page=0&size=10&nome=
GET /api/v1/feriados/{ano}
GET /api/v1/bancos
GET /api/v1/cep/{cep}
```

---

## 📖 Documentação da API

Com o back-end rodando, acesse a documentação Swagger em:

```bash
http://localhost:8080/swagger-ui.html
```

---

## 🗄️ Banco de Dados H2

O projeto utiliza o banco de dados H2 em ambiente de desenvolvimento.

Com o back-end rodando, acesse:

```bash
http://localhost:8080/h2-console
```

---

## 🌎 Integrações Externas

O projeto possui integrações externas utilizando OpenFeign, incluindo:

* ViaCEP
  Utilizado para busca e preenchimento automático de endereço por CEP.

* BrasilAPI
  Utilizada para consulta de feriados, CEP e bancos.

---

## 🎞️ Funcionalidades

* Listagem de conteúdos;
* Consulta de conteúdos em destaque;
* Consulta de conteúdos por ano;
* Paginação e busca de usuários;
* Integração com APIs externas;
* Consulta de CEP;
* Consulta de bancos;
* Consulta de feriados;
* Interface web em React;
* Comunicação entre front-end e back-end via proxy;
* Documentação da API com Swagger;
* Banco H2 para ambiente local.

---

## 🧪 Scripts do Front-end

Dentro da pasta `front-end`, os principais scripts são:

```bash
npm run dev
```

Inicia o servidor de desenvolvimento com Vite.

```bash
npm run build
```

Gera a versão de produção do projeto.

```bash
npm run preview
```

Executa uma prévia local da build de produção.

---

## 🔧 Scripts do Back-end

Dentro da pasta `back-end`, execute:

```bash
mvn spring-boot:run
```

Ou no Windows:

```bash
.\mvnw.cmd spring-boot:run
```

---

## ✅ Fluxo Recomendado para Rodar o Projeto

1. Clone o repositório:

```bash
git clone https://github.com/Harlen539/IespFlix.git
```

2. Acesse a pasta do back-end:

```bash
cd IespFlix/tecback-master/back-end
```

3. Rode o back-end:

```bash
mvn spring-boot:run
```

4. Abra outro terminal e acesse o front-end:

```bash
cd IespFlix/tecback-master/front-end
```

5. Instale as dependências:

```bash
npm install
```

6. Rode o front-end:

```bash
npm run dev
```

7. Acesse a aplicação:

```bash
http://localhost:5175
```

---

## 🧑‍💻 Autor

Desenvolvido por **Harlen Henrick**.

GitHub:

```bash
https://github.com/Harlen539
```

---

## 🎓 Informações Acadêmicas

Projeto acadêmico desenvolvido para a disciplina de **BackEnd - Tecnologias Web**.

* Instituição: UNIESP
* Professor: Rodrigo Fujioka

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

Consulte o arquivo `LICENSE` para mais detalhes.

---

## 📌 Observações

Este projeto tem finalidade acadêmica e foi desenvolvido para praticar conceitos de desenvolvimento full stack, integração entre front-end e back-end, consumo de APIs REST e organização de aplicações web modernas.

````

[1]: https://github.com/Harlen539/IespFlix/tree/main/tecback-master "IespFlix/tecback-master at main · Harlen539/IespFlix · GitHub"
[2]: https://raw.githubusercontent.com/Harlen539/IespFlix/main/tecback-master/back-end/pom.xml "raw.githubusercontent.com"
[3]: https://raw.githubusercontent.com/Harlen539/IespFlix/main/tecback-master/front-end/package.json "raw.githubusercontent.com"
[4]: https://raw.githubusercontent.com/Harlen539/IespFlix/main/tecback-master/front-end/vite.config.js "raw.githubusercontent.com"
