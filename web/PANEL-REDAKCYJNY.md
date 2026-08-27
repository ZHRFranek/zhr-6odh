# Panel redakcyjny — ZHR

Strona produkcyjna w **Astro** z panelem **Decap CMS** (`/admin`). Treści tekstowe w `src/data/site.json`, zdjęcia galerii w `src/content/gallery/*.json`, pliki graficzne w `public/uploads/`.

## Szybki start (lokalnie)

```bash
cd web
npm install
npm run dev
```

Strona: http://localhost:4321

### Panel redakcyjny (dev)

W **dwóch terminalach**:

```bash
# Terminal 1 — strona
npm run dev

# Terminal 2 — backend CMS (zapis lokalny bez GitHub)
npm run cms
```

Panel: http://localhost:4321/admin/index.html (lub `/admin/` po restarcie serwera)

> W trybie lokalnym logowanie do panelu jest wyłączone — Decap używa `local_backend`.

## Co można edytować

| Sekcja panelu | Zawartość |
|---------------|-----------|
| **Galeria** | Dodawanie/usuwanie zdjęć, podpis, zastęp, typ, rok |
| **Treści strony** | Hero, O drużynie, zastępy, kadra, kalendarz, kontakt, stopka |

Po **Publish** w panelu (na Netlify) zmiany trafiają do GitHuba i strona przebudowuje się automatycznie.

## Wdrożenie na Netlify

**Pełna instrukcja:** [NETLIFY-WDROZENIE.md](./NETLIFY-WDROZENIE.md)

Skrót:

1. Repozytorium GitHub (cały folder `ZHR/`, base directory w Netlify: `web`)
2. Netlify: Import from Git → base `web`, build `npm run build`, publish `dist`
3. Włącz **Identity** (Invite only) + **Git Gateway**
4. Zaproś redaktora mailem
5. Panel: `https://twoja-strona.netlify.app/admin/`

Po deployu **Publish** w panelu = commit do GitHub + auto-deploy strony.
## Struktura

```
web/
├── public/
│   ├── admin/          # Decap CMS (config.yml + index.html)
│   └── uploads/        # zdjęcia wrzucane z panelu
├── src/
│   ├── content/gallery/  # wpisy galerii (JSON)
│   ├── data/site.json    # teksty strony
│   ├── components/
│   ├── layouts/
│   └── pages/
└── netlify.toml
```

## Uwagi

- Mockup HTML w `../strona/index.html` pozostaje jako archiwum; wersja z panelem to `web/`.
- Formularz kontaktu to nadal demo — w produkcji można podłączyć Netlify Forms.
- Przed pierwszym publishem na Netlify uzupełnij `backend.repo` w `config.yml`.
