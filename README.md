# WALL — statyczny landing page Next.js na Firebase Spark

WALL to kompletny serwis webowy dla marki oferującej prefabrykowane ściany z prawdziwej cegły montowane na działce klienta w 1 dzień. Projekt jest przygotowany jako statyczny eksport Next.js App Router do folderu `out` i może być wdrożony na Firebase Hosting w darmowym planie Firebase Spark.

## Założenia techniczne

- Next.js App Router, React i TypeScript
- Tailwind CSS
- Firebase Web SDK i Firebase Authentication po stronie klienta
- Brak Firestore, Realtime Database, Cloud Functions, Cloud Storage, API routes i SSR
- Static export przez `next build`
- Folder publikacji Firebase Hosting: `out`
- Panel administracyjny zapisuje konfigurację wyłącznie w `localStorage`

## Struktura projektu

- `app/layout.tsx` — globalny layout i provider autoryzacji
- `app/page.tsx` — statyczna strona główna
- `app/login/page.tsx` — logowanie Email/Password przez Firebase Authentication
- `app/admin/page.tsx` — chroniony dashboard
- `app/admin/config/page.tsx` — lokalny edyt[package.json](package.json)or konfiguracji strony
- `components/*` — komponenty UI, landing page, formularz i panel
- `lib/firebase.ts` — inicjalizacja Firebase Web SDK
- `lib/auth.tsx` — `AuthPro[.firebaserc](.firebaserc)vider`, `useAuth` i `ProtectedRoute`
- `lib/site-config.ts` — domyślna konfiguracja i obsługa `localStorage`
- `types/site-config.ts` — typ `SiteConfig`
- `public/site-config.json` — globalna konfiguracja strony do wdrożenia
- `public/images/*` — statyczne grafiki SVG używane w sekcjach

## 1. Instalacja zależności

```bash
npm install
```

## 2. Utworzenie projektu Firebase

1. Wejdź do Firebase Console.
2. Utwórz nowy projekt Firebase.
3. Projekt może działać w planie Spark, ponieważ używa tylko Firebase Hosting oraz Firebase Authentication po stronie klienta.

## 3. Włączenie Authentication Email/Password

1. W Firebase Console przejdź do **Authentication**.
2. Otwórz zakładkę **Sign-in method**.
3. Włącz provider **Email/Password**.
4. Dodaj użytkownika testowego w zakładce **Users**.

## 4. Dodanie aplikacji webowej Firebase

1. W ustawieniach projektu Firebase wybierz ikonę aplikacji webowej.
2. Zarejestruj aplikację webową.
3. Skopiuj wartości konfiguracji: `apiKey`, `authDomain`, `projectId`, `appId`.

## 5. Uzupełnienie `.env.local`

Skopiuj plik przykładowy:

```bash
cp .env.example .env.local
```

Uzupełnij wartości:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Zmienne mają prefiks `NEXT_PUBLIC_`, ponieważ Firebase Authentication działa po stronie klienta.

## 6. Lokalne uruchomienie

```bash
npm run dev
```

Otwórz `http://localhost:3000`.

## 7. Build statyczny

```bash
npm run build
```

Next.js ma ustawione:

- `output: 'export'`
- `trailingSlash: true`
- `images.unoptimized: true`

Po buildzie powstaje folder `out` gotowy do wdrożenia na Firebase Hosting.

## 8. Firebase login

```bash
firebase login
```

## 9. Firebase init hosting

Możesz użyć dołączonego `firebase.json`, ale jeśli inicjalizujesz hosting od zera, uruchom:

```bash
firebase init hosting
```

W trakcie konfiguracji wybierz projekt Firebase i ustaw katalog publiczny na `out`.

## 10. Ustawienie public directory na `out`

Podczas `firebase init hosting` wybierz:

- public directory: `out`
- single-page app rewrite: `No`
- overwrite `index.html`: `No`

W repo znajduje się też `.firebaserc.example`. Skopiuj go do `.firebaserc` i podmień identyfikator projektu:

```bash
cp .firebaserc.example .firebaserc
```

## 11. Deploy na Firebase Hosting

Najpierw zbuduj statyczny eksport:

```bash
npm run build
```

Następnie wdrożenie:

```bash
firebase deploy
```

## 12. Jak działa panel admina bez bazy

Panel pod `/admin` jest chroniony przez Firebase Authentication. Niezalogowany użytkownik jest przekierowany do `/login`.

Edytor `/admin/config` nie zapisuje danych do Firestore, Storage, Functions ani API. Zapis lokalny trafia do `localStorage` aktualnej przeglądarki. Oznacza to, że zmiany są widoczne tylko dla osoby korzystającej z tej przeglądarki i nie publikują się globalnie.

W panelu dostępne są przyciski:

- **Zapisz lokalnie** — zapisuje konfigurację w `localStorage`
- **Przywróć domyślne** — usuwa lokalną konfigurację i wraca do `public/site-config.json`
- **Eksportuj JSON** — pobiera aktualną konfigurację jako plik `site-config.json`
- **Importuj JSON** — wczytuje konfigurację z pliku do podglądu i edycji

## 13. Jak opublikować globalne zmiany konfiguracji

1. Zaloguj się do `/login`.
2. Przejdź do `/admin/config`.
3. Zmień treści strony.
4. Kliknij **Eksportuj JSON**.
5. Podmień plik `public/site-config.json` wyeksportowanym plikiem.
6. Uruchom ponownie build:

```bash
npm run build
```

7. Wdróż stronę:

```bash
firebase deploy
```

## Formularz „Wyślij projekt”

Formularz na stronie jest statycznym elementem demonstracyjnym. Po wysłaniu pokazuje komunikat informujący, że odbiór zgłoszeń wymaga zewnętrznego systemu formularzy albo przejścia na usługę z backendem. Projekt nie używa SendGrid, Nodemailer, Cloud Functions ani API routes.

## Krótka instrukcja uruchomienia

```bash
npm install
cp .env.example .env.local
npm run dev
npm run build
firebase login
firebase init hosting
firebase deploy
```
