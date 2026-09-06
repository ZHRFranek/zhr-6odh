# Logowanie do panelu — wszystkie przeglądarki i telefon

Panel `/admin/` używa **GitHub OAuth** (Netlify Function) zamiast Netlify Identity.  
Działa w Chrome, Edge, Firefox, Safari i na telefonie.

## Jednorazowa konfiguracja (właściciel strony)

### 1. GitHub OAuth App

1. [github.com/settings/applications/new](https://github.com/settings/applications/new)
2. Wypełnij:

| Pole | Wartość |
|------|---------|
| Application name | `ZHR 6 ODH CMS` |
| Homepage URL | `https://zhr-6odh.netlify.app` |
| Authorization callback URL | `https://zhr-6odh.netlify.app/oauth/callback` |

3. **Register application**
4. **Generate a new client secret** — skopiuj **Client ID** i **Client Secret**

### 2. Zmienne w Netlify

1. [app.netlify.com](https://app.netlify.com) → projekt **zhr-6odh**
2. **Project configuration** → **Environment variables**
3. Dodaj (Production + Deploy previews):

| Klucz | Wartość |
|-------|---------|
| `GITHUB_CLIENT_ID` | Client ID z GitHub |
| `GITHUB_CLIENT_SECRET` | Client Secret z GitHub |

4. **Save** → **Deploys** → **Trigger deploy** → **Deploy site**

### 3. (Opcjonalnie) Wyłącz Netlify Identity

**Project configuration** → **Identity** → wyłącz — nie jest już potrzebne.

---

## Logowanie redaktora

1. Wejdź na **https://zhr-6odh.netlify.app/admin/**
2. Kliknij **Login with GitHub**
3. Zaloguj się kontem GitHub z dostępem do repo `ZHRFranek/zhr-6odh`

Konto **ZHRFranek** (właściciel repo) ma dostęp od razu.  
Inna osoba musi być **współpracownikiem** repozytorium na GitHubie (Settings → Collaborators).

---

## Lokalny development

Bez zmian — w dwóch terminalach:

```bash
cd web
npm run dev    # terminal 1
npm run cms    # terminal 2
```

Panel: http://localhost:4321/admin/ (bez logowania, `local_backend`).

---

## Pliki

| Plik | Rola |
|------|------|
| `netlify/functions/oauth.js` | Wymiana kodu OAuth na token GitHub |
| `public/admin/config.yml` | Backend `github` + ścieżka OAuth |
| `public/admin/index.html` | Decap CMS (bez Netlify Identity) |

Po **Publish** w panelu zmiany trafiają do GitHub → Netlify przebudowuje stronę (jak dotąd).
