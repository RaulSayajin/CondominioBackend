# 📸 Evidências - Parte 2 do Projeto

## Backend - `/media` do backend

As seguintes evidências devem ser incluídas nesta pasta:

### 1. Rota base `/` funcionando em container Docker

- **Arquivo**: `01_backend_rota_base.png`
- **Descrição**: Print do navegador mostrando `http://localhost:5000/` ou via Codespaces
- **Conteúdo esperado**:
  ```json
  {
    "message": "API Condomínios respondendo corretamente",
    "status": "online",
    "timestamp": "09/06/2026 10:30:45"
  }
  ```

### 2. Rota `/v1` funcionando em container Docker

- **Arquivo**: `02_backend_rota_v1.png`
- **Descrição**: Print do navegador mostrando `http://localhost:5000/v1`
- **Conteúdo esperado**:
  ```json
  {
    "message": "Api v1 respondendo no container docker...",
    "chamada_em": "09/06/2026, 10:30:50",
    "versao": "1.1.0"
  }
  ```

### 3. Painel Events do Render

- **Arquivo**: `03_backend_render_events.png`
- **Descrição**: Print do painel de eventos do Render mostrando histórico de deploy
- **Localização**: `https://dashboard.render.com` → seu projeto → Events

### 4. Tag v1.1.0 do Backend

- **Arquivo**: `04_backend_tag_v1_1_0.png`
- **Descrição**: Print do GitHub mostrando a tag `v1.1.0` criada
- **Localização**: GitHub repo → Releases → v1.1.0

---

## Frontend - `/media` do frontend

As seguintes evidências devem ser incluídas nesta pasta:

### 1. Frontend no Codespaces na porta 8080

- **Arquivo**: `01_frontend_codespaces_port_8080.png`
- **Descrição**: Print do navegador mostrando o frontend rodando via Nginx em container
- **URL**: `https://[seu-codespace]-8080.app.github.dev`

### 2. Frontend consumindo API do backend em Docker

- **Arquivo**: `02_frontend_consuming_api.png`
- **Descrição**: Print mostrando:
  - Frontend aberto
  - Console do navegador (F12) mostrando requisições para `http://localhost:5000/v1`
  - Resposta da API sendo exibida

### 3. Painel Deployments da Vercel

- **Arquivo**: `03_frontend_vercel_deployments.png`
- **Descrição**: Print do painel de deployments da Vercel mostrando histórico
- **Localização**: `https://vercel.com` → seu projeto → Deployments

### 4. Tag v1.1.0 do Frontend

- **Arquivo**: `04_frontend_tag_v1_1_0.png`
- **Descrição**: Print do GitHub mostrando a tag `v1.1.0` criada
- **Localização**: GitHub repo → Releases → v1.1.0

---

## Como Gerar as Evidências

### No Backend

1. **Inicie container**

   ```bash
   docker-compose up --build
   ```

2. **Acesse rotas no navegador**
   - `http://localhost:5000/`
   - `http://localhost:5000/v1`

3. **Verifique no Render**
   - Acesse `https://dashboard.render.com`
   - Vá em seu projeto
   - Clique em "Events"

4. **Obtenha tag no GitHub**
   - Vá em "Releases"
   - Procure por `v1.1.0`

### No Frontend

1. **No Codespaces**

   ```bash
   npm run build
   docker build -t condominios-frontend .
   docker run -p 8080:80 condominios-frontend
   ```

2. **Acesse no navegador**
   - Clique na porta 8080 no Codespaces
   - Confirme que frontend está visível

3. **Abra console (F12)**
   - Veja as requisições para `http://localhost:5000/v1`
   - Confirme que data/hora está retornando

4. **Painel Vercel**
   - Acesse `https://vercel.com/dashboard`
   - Vá em seu projeto
   - Clique em "Deployments"

---

## Checklist de Evidências

- [ ] Backend - Rota base `/` funcionando
- [ ] Backend - Rota `/v1` com timestamp
- [ ] Backend - Render Events panel
- [ ] Backend - Tag v1.1.0
- [ ] Frontend - Nginx rodando em container (port 8080)
- [ ] Frontend - Consumindo API (console.log visível)
- [ ] Frontend - Vercel Deployments panel
- [ ] Frontend - Tag v1.1.0

---

**Todas as imagens devem ser PNG e salvos nesta pasta com nomes descritivos.**