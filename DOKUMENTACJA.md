# ZHR — dokumentacja projektu

Plik roboczy do zapisywania **zmian w kodzie**, **decyzji projektowych** i **uwag do wdrożenia**.  
Aktualizowany na bieżąco w trakcie pracy nad stroną drużyny.

---

## Stan projektu

| Element | Status |
|---------|--------|
| Ikona pulpitu + launcher | ✅ gotowe |
| Mockup HTML (`strona/index.html`) | ✅ wstępna wersja |
| Astro + panel redakcyjny (`web/`) | ✅ v1 (Decap CMS) |
| Wdrożenie Netlify + Identity | 📋 instrukcja: `web/NETLIFY-WDROZENIE.md` |
| Dane drużyny (treści, zdjęcia) | ⏳ do uzupełnienia |

**Nazwa docelowa strony:** 6 ODH *(wg uwag)*

---

## Struktura katalogów

```
F:\Jurek\ZHR\
├── assets\              # ikona (zhr.ico, zhr-icon.png)
├── scripts\
│   ├── launch-zhr.vbs           # uruchamia najnowszy HTML z strona/
│   └── install-desktop-icon.ps1 # instaluje skrót ZHR.lnk na pulpicie
├── strona\
│   ├── index.html               # mockup strony (archiwum / podgląd lokalny)
│   └── galeria\                 # zdjęcia mockupu
├── web\                         # wersja produkcyjna Astro + Decap CMS
│   ├── public/admin/            # panel redakcyjny (/admin)
│   ├── src/data/site.json       # teksty edytowalne
│   ├── src/content/gallery/     # wpisy galerii
│   └── PANEL-REDAKCYJNY.md      # instrukcja panelu i Netlify
├── DOKUMENTACJA.md              # ten plik
└── Uwagi.txt                    # surowe notatki użytkownika (archiwum)
```

**Uruchomienie:** dwuklik ikony **ZHR** na pulpicie → uruchamia serwer Astro (`web/`) i otwiera http://localhost:4321/ (panel: `/admin/`). Stary mockup HTML: `scripts/launch-zhr-html.vbs`.

---

## Architektura strony (docelowa)

1. **Hero** — tożsamość drużyny, CTA  
2. **O drużynie** — historia, patron, barwy, tradycje, mapa działania  
3. **Zastępy** — lista zastępów ze składem i opisem  
4. **Kadra** — drużynowy, przyboczni, kwatermistrz  
5. **Nabory** *(dawniej: Jak dołączyć / Rekrutacja)* — kroki, terminy, formularz, FAQ  
6. **Galeria** — zdjęcia z systemem tagów (zastęp, typ) + lightbox  
7. **Kalendarz** — wydarzenia drużyny, hufca, chorągwi  
8. **Kontakt** — mail, telefon, formularz  

### Styl wizualny (propozycja)

- Kolory: `#1F3D2B`, `#4A6B4F`, `#D9CBB3`, `#FFFFFF`, `#000000`
- Nagłówki: Montserrat / Inter  
- Tekst: Inter / Roboto  
- Estetyka: nowoczesna, minimalistyczna, harcerska (zieleń, beż)

### Technologia (plan)

- **Astro + Decap CMS** — strona statyczna + panel `/admin` (teksty + galeria)
- **Netlify** — hosting, auto-deploy z GitHub, Identity + Git Gateway dla redaktora

---

## Panel redakcyjny

Szczegóły: `web/PANEL-REDAKCYJNY.md`

- **Lokalnie:** `npm run dev` + `npm run cms` → http://localhost:4321/admin/
- **Produkcja:** Netlify Identity (1 redaktor) → Publish w panelu = auto-deploy
- **Galeria:** upload zdjęć, zastęp, typ aktywności, podpis
- **Teksty:** `src/data/site.json` — hero, sekcje, kadra, kalendarz, kontakt

---

## System tagów — Galeria

Każde zdjęcie ma atrybuty HTML:

| Atrybut | Opis | Przykład |
|---------|------|----------|
| `data-zastep` | Zastęp (wymagany) | `"1"` … `"4"` |
| `data-tags` | Tagi po przecinku | `"oboz,2025,publiczne"` |

### Warstwy tagów

**A — Zastęp** (filtr główny, przyciski): Zastęp [Nazwa 1–4]  
**B — Typ aktywności** (przyciski): `oboz`, `biwak`, `akcja`, `zbiorka`  
**C — Meta** (tylko w `data-tags`, bez filtra UI): rok (`2025`, `2026`), `publiczne`, `wrazliwe`, `archiwum`

### Logika filtrowania

- Wejście w **Galerię** (menu) = reset filtrów, wszystkie zdjęcia widoczne.
- **Zastęp** — podświetlenie trwa, dopóki użytkownik nie wybierze innego zastępu.
- **Typ** — opcjonalne zawężenie (AND z wybranym zastępem); nie gasi podświetlenia zastępu.

### Przykład wpisu (docelowo YAML / frontmatter)

```yaml
file: oboz-2025-orly-01.jpg
title: Obóz 2025 — ognisko
tags:
  - zastep:1
  - oboz
  - 2025
  - publiczne
```

---

## Dziennik zmian

Format: `RRRR-MM-DD — opis`

### 2026-08-27 (cd.)

- **Panel redakcyjny v1** — Astro w `web/`, Decap CMS (`/admin`), treści w JSON, galeria z uploadem
- **Netlify** — `netlify.toml`, instrukcja wdrożenia w `web/PANEL-REDAKCYJNY.md`

### 2026-08-27

- **Galeria** — usunięty filtr roku (2025, 2026) z panelu tagów
- **Galeria** — podświetlenie zastępu trwa do wyboru innego zastępu (tag typu nie gasi)
- **Galeria** — reset filtrów po kliknięciu „Galeria” w menu (brak aktywnych tagów)
- **Galeria** — 6 zdjęć zbiórki Zastęp [Nazwa 4] z `F:\Jurek\Restore\ZHAR` (`strona/galeria/zastep-4-zbiorka/`)
- **Launcher** — kopiuje folder `galeria/` razem ze stroną (zdjęcia lokalne)
- **Galeria** — usunięte tagi: Rajd, Hufiec, Chorągiew
- **Galeria** — pełny system tagów: zastęp + typ aktywności + rok (filtry AND)
- **Galeria** — usunięte foldery/kategorie (Obozy, Biwaki, Rajdy, Akcje)
- **Hero** — usunięty przycisk „Dołącz do drużyny”
- **Nawigacja** — wyróżnienie pozycji menu po najechaniu kursorem (tło + pogrubienie)
- **Nawigacja** — usunięte obramowania przycisków w menu (zwykłe linki tekstowe)
- **Nawigacja** — jednolite obramowanie przycisków w menu (jak Kontakt)
- **Nawigacja** — przycisk „Kontakt”: białe tło i ciemny tekst (czytelny na ciemnym tle strony)
- **Kadra → Kontakt** — przeniesione przyciski FB i IG do zakładki Kontakt

### 2026-08-26

- **Ikona pulpitu** — zmiana znaku graficznego na harcerską liliykę (`assets/zhr-liliyka.ico`, wielorozmiarowy ICO)
- **Zastępy** — usunięty przycisk „Dołącz do zastępu” z modułów
- **Sekcja „Jak dołączyć”** — identyczna wielkość modułów jak w Zastępy (układ + miejsce na treść)
- **Sekcja „Jak dołączyć”** — czarny obrys modułów jak w Zastępy; miejsce pod nazwą na treść
- **Zastępy** — obwódka modułów: czarna, 2px
- **Sekcja „Jak dołączyć”** — usunięte linie „Skład:…” z modułów
- **Sekcja „Jak dołączyć”** — usunięte opisy zastępów z modułów
- **Sekcja „Jak dołączyć”** — wyoblone rogi modułów na górze i na dole (24px)
- **Sekcja „Jak dołączyć”** — wklejone 4 moduły zastępów (jak w Zastępy, bez przycisku „Dołącz do zastępu”)
- **Zastępy** — układ 4 modułów w jednym rzędzie (obok siebie)
- **Zastępy** — dodany moduł „Zastęp [Nazwa 4]”
- **Sekcja „Jak dołączyć”** — usunięta cała dotychczasowa treść (kroki, formularz, FAQ); sekcja pusta, gotowa pod nową zawartość
- **Nawigacja** — zmiana nazwy zakładki „Dołącz” → „Jak dołączyć”

### 2026-08-25

- **Utworzenie projektu** — katalog `F:\Jurek\ZHR`, launcher VBS, ikona pulpitu `ZHR.lnk`
- **Mockup strony** — pełny szkielet HTML ze wszystkimi 8 sekcjami, placeholdery `[ ]`, responsywność, menu mobilne, galeria z lightboxem, FAQ accordion
- **Kadra** — zmiana „Przyboczna · hr. [Stopień]” → „Przyboczny · hr. [Stopień]”
- **Galeria** — usunięty przycisk filtra „Wszystkie”; pozostały: Obozy, Biwaki, Rajdy, Akcje (przy wejściu widać wszystkie zdjęcia)
- **DOKUMENTACJA.md** — utworzenie pliku dokumentacyjnego

---

## Uwagi i TODO (do wdrożenia)

Poniżej zebrane uwagi z `Uwagi.txt` oraz rozmów — do realizacji w kolejnych iteracjach.

### Treść i nazewnictwo

- [ ] Zmienić nazwę strony na **6 ODH**
- [ ] Zmienić „Rekrutacja” → **„Nabory”**
- [ ] Zmienić „Dołącz do drużyny” → **„Jak dołączyć do drużyny”**
- [ ] Usunąć nagłówek **„Odpowiedzialni”** w sekcji Kadra
- [ ] Ustalić **ostateczne kolory** strony (barwy drużyny)

### Nabory (nowa koncepcja)

- [ ] Zmienić sposób rekrutacji — **nabory nie przez internet** (kontakt bezpośredni)
- [ ] Dodać informacje o zastępach w sekcji naborów:
  - nazwa zastępu
  - miejsce zbiórek
  - szkoły, w których będą zastępowi
  - informacja o zbiórce ponaborowej
  - dane kontaktowe zastępowego
- [ ] Dodać **zgody ZHR** na stronie
- [ ] Dodać informację o **składkach**

### Lokalizacja i mapy

- [ ] Przenieść „Lokalizacja zbiórek” z Kontaktu → **przy poszczególnych zastępach**
- [ ] Zastanowić się nad sensem **map** (czy zostają, gdzie, ile)

### Techniczne / UX

- [ ] **Wersja mobilna** — dopracować (mockup ma podstawową responsywność)
- [ ] **Kod QR** na ulotki (link do strony)

---

## Dane do uzupełnienia (od użytkownika)

Aby zamienić mockup w docelową stronę, potrzebne:

1. Nazwa drużyny *(docelowo: 6 ODH)*  
2. Patron  
3. Barwy (jeśli inne niż propozycja)  
4. Lista zastępów (nazwy, znaki, opisy, miejsca zbiórek, szkoły)  
5. Kadra (imiona, stopnie, zdjęcia)  
6. Lokalizacja (miasto, hufiec, chorągiew)  
7. Zdjęcia (hero, galeria, archiwum)  
8. Terminy zbiórek, wydarzenia kalendarza  
9. Dane kontaktowe (mail, telefon)  
10. Treść FAQ, składki, zgody  

---

## Notatki robocze

*(Miejsce na bieżące uwagi z sesji — dopisywane przy każdej zmianie)*

- Mockup używa placeholderów w nawiasach `[ ]` — łatwe do wyszukania i podmiany
- Formularze kontaktowe w mockupie **nie wysyłają danych** (alert demo)
- Zdjęcia w galerii i hero: stock Unsplash (tymczasowe)
- Baner na dole strony informuje, że to wstępny mockup

---

*Ostatnia aktualizacja: 2026-08-25*
