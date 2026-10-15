# Gelô Sorveteria — Tailwind CSS v4

Landing page responsiva para uma sorveteria, com fotos, filtros de sabores e pedido enviado ao WhatsApp.

## Requisitos
- Node.js 20.19+ (ou versão compatível com Vite)
- npm

## Instalação
```bash
npm install
npm run dev
```
Abra o endereço local exibido pelo Vite no terminal.

## Build de produção
```bash
npm run build
npm run preview
```

## Tailwind CSS v4
- `src/input.css`: entrada do Tailwind v4 e tokens do tema em `@theme`.
- `src/site.css`: estilos complementares para componentes e animações de layout.
- `src/main.js`: menu mobile, filtros, carrinho e montagem da mensagem para WhatsApp.
- `index.html`: estrutura da página.

O Vite processa o Tailwind por meio de `@tailwindcss/vite`. Não é necessário criar `tailwind.config.js` para este tema.

## Personalização obrigatória
1. Em `src/main.js`, altere `WHATSAPP_NUMBER` para o número comercial no formato internacional, somente números. O valor atual é um exemplo reaproveitado do projeto enviado.
2. Revise os sabores, preços e descrições em `index.html` e o objeto `PRICES` em `src/main.js`.
3. As fotos são carregadas de URLs do Unsplash e precisam de conexão com a internet. Para produção, recomenda-se baixar imagens licenciadas/aprovadas pela loja e salvar localmente em `assets/img/`.
4. O texto institucional, endereço e informações comerciais são demonstrativos; substitua pelos dados reais antes de publicar.

## Observação
A página usa imagens remotas de demonstração. Confira cada imagem e sua licença/atribuição antes de publicar comercialmente.