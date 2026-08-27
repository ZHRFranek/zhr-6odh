# Wdrożenie na Netlify — krok po kroku

Strona drużyny (Astro) + panel redakcyjny Decap CMS. Repozytorium obejmuje cały folder `ZHR/`; Netlify buduje tylko podkatalog `web/`.

## Wymagania

- konto [GitHub](https://github.com)
- konto [Netlify](https://netlify.com) (darmowe wystarczy)
- projekt lokalny w `F:\Jurek\ZHR` (ten folder)

---

## 1. Repozytorium GitHub

W PowerShell (w folderze projektu):

```powershell
cd F:\Jurek\ZHR
git init -b main
git add -A
git status
git commit -m "Strona drużyny ZHR — Astro + Decap CMS"
```

Na GitHub: **New repository** → np. `zhr-6odh` → **bez** README (repo już istnieje lokalnie).

Podłącz remote i wypchnij:

```powershell
git remote add origin https://github.com/TWOJ-LOGIN/zhr-6odh.git
git push -u origin main
```

Zamień `TWOJ-LOGIN` i nazwę repo na swoje.

---

## 2. Nowa strona w Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. **GitHub** → wybierz repozytorium `zhr-6odh`
3. Ustawienia buildu:

| Pole | Wartość |
|------|---------|
| **Base directory** | `web` |
| **Build command** | `npm run build` |
| **Publish directory** | `web/dist` |

> Jeśli Base directory = `web`, Netlify sam znajdzie `netlify.toml` i możesz zostawić Publish = `dist` (względem `web/`).

4. **Deploy site** — pierwszy build powinien przejść (Node 22, zgodnie z `netlify.toml`).

Adres tymczasowy: `https://cos-losowego.netlify.app`

---

## 3. Netlify Identity (logowanie do panelu)

1. W Netlify: **Site configuration** → **Identity**
2. **Enable Identity**
3. **Registration preferences** → **Invite only** (tylko zaproszeni redaktorzy)
4. **Identity** → **Services** → **Git Gateway** → **Enable Git Gateway**

Git Gateway łączy panel `/admin/` z repozytorium GitHub — po **Publish** w CMS zmiany trafiają do GitHuba, a Netlify przebudowuje stronę.

---

## 4. Zaproszenie redaktora

1. **Identity** → **Invite users**
2. Wpisz e-mail redaktora (np. drużynowego)
3. Po kliknięciu linku z maila użytkownik ustawia hasło i trafia na stronę; po zalogowaniu przekierowanie do `/admin/` działa automatycznie.

---

## 5. Panel redakcyjny

Adres produkcyjny:

```
https://TWOJA-STRONA.netlify.app/admin/
```

- **Lokalnie** (`npm run dev` + `npm run cms`): logowanie wyłączone — `local_backend` w `config.yml`
- **Na Netlify**: logowanie przez Netlify Identity + Git Gateway

---

## 6. (Opcjonalnie) Własna domena

**Domain management** → **Add domain** → postępuj według instrukcji DNS u rejestratora.

---

## 7. Weryfikacja po wdrożeniu

- [ ] Strona główna się ładuje
- [ ] `/admin/` pokazuje ekran logowania Netlify Identity
- [ ] Po zalogowaniu widać sekcje **Galeria** i **Treści strony**
- [ ] Testowa edycja w CMS → **Publish** → po ~1–2 min nowa treść na stronie
- [ ] W GitHub widać commit z panelu

---

## Rozwiązywanie problemów

| Problem | Co sprawdzić |
|---------|----------------|
| Build failed | Logi w Netlify → Deploys; lokalnie: `cd web && npm run build` |
| Panel nie loguje | Identity włączone, Git Gateway włączone, użytkownik zaproszony |
| Publish nie zapisuje | Git Gateway + repo podpięte pod tę samą stronę Netlify |
| 404 na `/admin/` | `netlify.toml` — redirecty admin (już skonfigurowane) |
| Stara treść po Publish | Poczekaj na rebuild; sprawdź Deploys w Netlify |

---

## Pliki konfiguracyjne

- `web/netlify.toml` — build, Node 22, redirecty `/admin`
- `web/public/admin/config.yml` — kolekcje CMS (galeria, `site.json`)
- `web/public/admin/index.html` — Decap CMS + widget Identity

Szczegóły panelu: [PANEL-REDAKCYJNY.md](./PANEL-REDAKCYJNY.md)
