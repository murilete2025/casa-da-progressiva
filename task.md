# Task: Painel Administrador — Casa da Progressiva

## Planejamento
- [x] Analisar estrutura do site atual (index.html, produtos, categorias, images)
- [x] Criar plano de implementação

## Implementação

### Sistema de dados (admin/data.js)
- [ ] Criar arquivo JS que carrega dados dos produtos via localStorage
- [ ] Inicializar com os dados atuais do site (16 produtos, 5 categorias)

### Painel Admin (admin/index.html)
- [ ] Login com senha simples
- [ ] Dashboard com estatísticas
- [ ] Gestão de Produtos (listar, criar, editar, excluir)
- [ ] Upload de imagens por produto (base64 no localStorage)
- [ ] Gestão de Categorias (criar, editar, excluir)
- [ ] Editor da Home (banners hero, banners de categoria, seção destaque)
- [ ] Editor de página de produto (título, descrição, preço, link botão, badge)
- [ ] Substituição de imagens hero/banners

### Integração com o site existente
- [ ] Modificar index.html para carregar dados do localStorage (se disponível)
- [ ] Modificar páginas de produto para usar dados do localStorage
- [ ] Manter compatibilidade total com o site atual (fallback para HTML estático)

## Verificação
- [ ] Testar login/logout
- [ ] Testar criação/edição/exclusão de produto
- [ ] Testar upload de imagem
- [ ] Testar edição da home
- [ ] Testar no browser
