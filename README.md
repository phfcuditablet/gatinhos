# Achei os Gatinhos 🐱

Jogo de lógica para navegador, inspirado em quebra-cabeças de posicionamento (estilo *Queens*/Meowdoku). O objetivo é encontrar o lugar certo de cada gatinho no tabuleiro colorido.

Funciona direto no navegador, sem instalação, sem servidor e sem dependências. Também funciona bem no celular.

## Regras

1. Cada **cor** tem exatamente **1 gato**.
2. Cada **linha** tem exatamente **1 gato**.
3. Cada **coluna** tem exatamente **1 gato**.
4. Os gatos **não podem se tocar**, nem na diagonal.

## Como jogar

| Toques na casa | Resultado |
|---|---|
| 1 | Marca ✕ (aqui não tem gato) |
| 2 | Coloca o gato 🐱 |
| 3 | Limpa a casa |

- **Vidas:** são 7 corações. Colocar um gato no lugar errado custa uma vida. Ao perder todas, a fase recomeça.
- **Contador:** mostra quantos gatos já foram colocados (por exemplo, 3/8).
- **Tracejado vermelho:** contorna as áreas onde não pode haver gato, ajudando principalmente as crianças. O ✕ claro nessas áreas é marcado automaticamente.
- **Opção "Mostrar onde não há gatinhos":** desmarque para jogar sem o tracejado e sem os ✕ automáticos. A escolha fica salva no navegador.
- **Dica:** faz piscar uma casa onde há um gato.
- **Recomeçar:** reinicia a fase atual com as vidas cheias.

## Fases

- Começam em 5×5 e chegam a 8×8 a partir do nível 8.
- Cada fase é gerada automaticamente e tem **solução única**.
- Os níveis são fixos: o nível 5 é sempre o mesmo tabuleiro.
- O nível atual fica salvo no navegador (`localStorage`).

## Estrutura do projeto

```
jogo-gatinhos/
├── index.html   Página e estrutura do jogo
├── style.css    Visual e responsividade
├── puzzle.js    Gerador de fases e verificação de solução única
├── game.js      Lógica do jogo, interface, vidas e dicas
└── README.md    Este arquivo
```

## Como executar

**Localmente:** abra o arquivo `index.html` no navegador.

**Publicar no GitHub Pages:**

1. Envie os arquivos para a raiz de um repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Source**, escolha a branch `main` e a pasta `/ (root)`.
4. Salve e aguarde o link ser gerado.

## Personalização

- **Quantidade de vidas:** constante `VIDAS_MAX` em `game.js`.
- **Tamanho das fases por nível:** função `tamanhoDoNivel` em `puzzle.js`.
- **Cores do tabuleiro:** lista `CORES` em `game.js`.
- **Regra de toque:** por padrão a diagonal conta como toque. Para permitir gatos na diagonal, a verificação precisa ser ajustada em `game.js` (conflitos e bloqueios) e em `puzzle.js` (gerador de fases).

## Tecnologias

HTML, CSS e JavaScript puros.
