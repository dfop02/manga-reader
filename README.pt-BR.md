# Manga Reader
Um simples e eficiente leitor de manga feito em JS

[English](https://github.com/dfop02/manga-reader/blob/main/README.md) | [Português BR](https://github.com/dfop02/manga-reader/blob/main/README.pt-BR.md)

### Como testar?

Você pode testar [aqui](https://dfop02.github.io/manga-reader/window.html) com algumas páginas de exemplo.

Se você preferir um teste mais completo, sinta-se livre para baixar o projeto e usar qualquer manga você quiser, apenas siga as instruções abaixo:


1. Baixe qualquer manga e adicione a pasta `manga` dentro do manga-reader
2. Vá no arquivo `src/main.js`, edite as configurações do usuário, da linha 7 a 10.
    - total_pages - Total de páginas que o capítulo tem
    - manga_name - Nome do Manga
    - filename - Nome dos arquivos (precisam ser todos iguais, mudando apenas o numero da página, ex: 1.filename.jpg, 2.filename.jpg, etc.)
    - source - O diretorio onde está (recomendo usar o padrão `manga` dentro do projeto)
3. Abra o arquivo window.html no navegador e agora só usar!

### Por que?

Esse código foi feito baseado nas minhas próprias experiências e a dos meus amigos consumindo mangas, absorvendo as melhores e piores práticas de todas as ferramentas, o objetivo é construir uma boa ferramenta que os usuários podem facilmente usar e apreciar.

### TO-DO

- Ser capaz de ler PDF também
- Add locale

### Autores

* [Diogo Fernandes](https://github.com/dfop02)

### Licença

Esse projeto é licenciado sobre a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.
