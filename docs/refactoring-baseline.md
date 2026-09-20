# Refactoring-Baseline

Dieses Dokument beschreibt den Ausgangszustand vor der Refaktorierung. Nach jedem
größeren Refaktorierungsschritt werden die technischen Checks und die Smoke-Tests
erneut ausgeführt.

## Ausgangszustand

- Projekt: Chronos
- Stack: React 19, TypeScript, Vite
- Persistenz: `localStorage`
- Arbeitsverzeichnis: `D:\GitHub\Chronos`
- Git-Status zum Zeitpunkt der Erfassung: sauber
- Produktions-Build: erfolgreich
- TypeScript-Prüfung: erfolgreich
- ESLint: mit der in Phase 2 ergänzten Konfiguration erfolgreich ausführbar

## Reproduzierbare technische Checks

```text
npm install
npm run typecheck
npm run build
npm run lint
```

Erwarteter Zustand vor Phase 2:

- `npm run typecheck`: erfolgreich
- `npm run build`: erfolgreich
- `npm run lint`: erfolgreich

Die Asset-Referenz auf `/Chronos/sidebar-background.png` wurde in Phase 2 auf den
korrekten Public-Pfad `/sidebar-background.png` korrigiert.

## Manuelle Smoke-Tests

Die folgenden Abläufe bilden die Mindestabdeckung für Regressionstests. Jeder Test
wird mit leerem und – sofern relevant – bereits befülltem `localStorage` geprüft.

### Dashboard und Aufgaben

- [ ] Dashboard öffnet ohne Fehler.
- [ ] Eine Aufgabe kann angelegt werden.
- [ ] Titel, Datum, Startzeit, Endzeit und Beschreibung werden angezeigt.
- [ ] Eine Aufgabe kann bearbeitet werden.
- [ ] Eine Aufgabe kann gelöscht werden.
- [ ] Eine Aufgabe kann als abgeschlossen/offen markiert werden.
- [ ] Der Tageswechsel über Kalender und Pfeile funktioniert.
- [ ] Die Tagesübersicht aktualisiert Anzahl und Fortschritt.

### Wiederholungen

- [ ] Tägliche Wiederholung wird an den erwarteten Tagen angezeigt.
- [ ] Wöchentliche Wiederholung wird am richtigen Wochentag angezeigt.
- [ ] Monatliche und jährliche Wiederholung werden korrekt berücksichtigt.
- [ ] Individuelle Wochentage funktionieren.
- [ ] Ein optionales Enddatum beendet die Wiederholung korrekt.

### Work Mode und Timer

- [ ] Work Mode kann für eine Aufgabe gestartet werden.
- [ ] Der Timer läuft und kann pausiert beziehungsweise fortgesetzt werden.
- [ ] Der Timer kann zurückgesetzt werden.
- [ ] Beim Beenden wird die investierte Zeit gespeichert.
- [ ] Eine Aufgabe kann aus dem Work Mode heraus abgeschlossen werden.
- [ ] Fullscreen kann geöffnet und wieder verlassen werden.

### Projekte

- [ ] Die Projektübersicht öffnet ohne Fehler.
- [ ] Ein Projekt kann angelegt werden.
- [ ] Ein Projekt kann geöffnet werden.
- [ ] Projektaufgaben können angelegt, bearbeitet, abgeschlossen und gelöscht werden.
- [ ] Milestones können angelegt, bearbeitet und gelöscht werden.
- [ ] Projektaufgaben können einem Milestone zugeordnet werden.
- [ ] Zur Projektübersicht kann zurück navigiert werden.

### Persistenz

- [ ] Nach einem Reload bleiben Aufgaben erhalten.
- [ ] Nach einem Reload bleiben Projekte erhalten.
- [ ] Nach einem Reload bleiben Milestones erhalten.
- [ ] Ungültige oder fehlende `localStorage`-Werte führen nicht zu einem Absturz.

## Ausführung der Checks

Die Checks wurden am 20.09.2026 ausgeführt:

| Check | Ergebnis |
| --- | --- |
| `npm run typecheck` | erfolgreich |
| `npm run build` | erfolgreich, ohne Asset-Warnung |
| `npm run lint` | erfolgreich |
| Git-Status vor dieser Dokumentation | sauber |
