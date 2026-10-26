# Chronos

Chronos ist eine browserbasierte Produktivitäts- und Projektmanagement-App. Sie verbindet einen persönlichen Tagesplan mit projektbezogenen Aufgaben, Milestones und einem fokussierten Arbeitsmodus mit integriertem Timer.

Die Anwendung richtet sich an Personen, die Aufgaben nicht nur verwalten, sondern auch planen, in konzentrierten Arbeitsintervallen bearbeiten und den tatsächlichen Zeitaufwand festhalten möchten.

> Hinweis: Chronos ist aktuell eine reine Frontend-Anwendung. Die Daten werden lokal im Browser gespeichert; es gibt derzeit kein Backend, kein Benutzerkonto und keine Cloud-Synchronisierung.

## Funktionen im Überblick

### Dashboard und Tagesplanung

Das Dashboard ist der zentrale Einstiegspunkt für den täglichen Arbeitsablauf.

- Tagesplan mit Aufgaben in chronologischer Reihenfolge
- Navigation zwischen Tagen über Pfeile und Kalender
- Monatskalender mit Auswahl eines beliebigen Datums und „Heute“-Schaltfläche
- Tagesübersicht mit offenen und abgeschlossenen Aufgaben
- Fortschrittsring für den aktuellen Tag
- Anzeige der pro Aufgabe investierten Zeit
- Leerer Zustand, wenn für den ausgewählten Tag noch nichts geplant ist
- Projektaufgaben-Pool mit den Gruppen „Überfällig“, „Heute“ und „Demnächst“
- Projektaufgaben können direkt für den heutigen Tagesplan eingeplant werden

<img width="1615" height="926" alt="grafik" src="https://github.com/user-attachments/assets/9decb3b5-3ebe-4928-88e2-f41a69597106" />


### Aufgabenverwaltung

Aufgaben können direkt im Dashboard erstellt und verwaltet werden.

- Titel, Datum, Startzeit, Endzeit und optionale Beschreibung
- Aufgaben bearbeiten, löschen und als erledigt bzw. offen markieren
- Aufgaben aus dem Tagesplan entfernen
- Zeitliche Sortierung nach Startzeit
- Anzeige von Projekt und Milestone, wenn die Aufgabe zu einem Projekt gehört
- Validierung wichtiger Eingaben und Begrenzung der Textlängen

<img width="1616" height="932" alt="grafik" src="https://github.com/user-attachments/assets/a0d52b92-0202-498a-be81-3804abf2b864" />


### Wiederkehrende Aufgaben

Eine Aufgabe kann als Wiederholung angelegt werden. Unterstützt werden:

- täglich
- wöchentlich
- monatlich
- jährlich
- individuell ausgewählte Wochentage
- optionales Enddatum für die Wiederholung

Die Wiederholungslogik wird anhand des ausgewählten Tages berechnet. Projektaufgaben folgen dagegen ihrer geplanten Tageszuordnung.  
<img width="1630" height="931" alt="grafik" src="https://github.com/user-attachments/assets/10412987-e5ed-4c87-81f9-fd84bdd169a8" />


### Work Mode und Aufgabentimer

Der Work Mode bietet eine fokussierte Ansicht für die aktuell bearbeitete Aufgabe.

- Timer auf Basis der geplanten Aufgabenzeit
- Start, Pause und Fortsetzen des Timers
- Timer zurücksetzen
- Fortschrittsanzeige als Ring
- Anzeige von aktueller Aufgabe, Beschreibung, geplantem Zeitfenster und Status
- Vorschau auf die nächste Aufgabe
- Aufgabe direkt aus dem Work Mode abschließen
- Work Mode beenden und investierte Zeit speichern
- Vollbildmodus über die Browser-Fullscreen-API

Beim Beenden wird die gemessene Zeit zur bereits investierten Zeit der Aufgabe addiert.

<img width="1588" height="925" alt="grafik" src="https://github.com/user-attachments/assets/c857c33a-ab17-432f-be36-fbbde2477720" />

### Projekte

Die Projektübersicht stellt alle Projekte als Karten dar. Eine Projektkarte zeigt unter anderem:

- Projektname und Beschreibung
- Projektbild bzw. Standarddarstellung
- Tags
- Aufgabenfortschritt
- Anzahl erledigter und gesamter Aufgaben
- Zeitraum
- Projektstatus

Neue Projekte können mit folgenden Angaben angelegt werden:

- Name
- Kategorie
- Beschreibung
- Projektziel
- Tags
- Status
- Start- und Enddatum
- optionales Projektbild

Das Enddatum darf nicht vor dem Startdatum liegen. Tags können einzeln über die Eingabetaste hinzugefügt und wieder entfernt werden.  
<img width="1626" height="925" alt="Chronos_Screenshot_2" src="https://github.com/user-attachments/assets/83327ef9-1e1b-4753-9c19-845873b4723b" />

### Projektdetails

Ein Projekt besitzt eine eigene Detailansicht mit mehreren Tabs:

- **Aufgaben** – projektbezogene Aufgaben erstellen, bearbeiten, erledigen, löschen und im Work Mode starten
- **Milestones** – wichtige Projektphasen mit Zeitraum, Status und Fortschritt verwalten
- **Dokumentation** – aktuell als zukünftiger Bereich vorgesehen
- **Ressourcen** – Bildergalerie und Dokumentliste als UI-Demonstration
- **Einstellungen** – Projektinformationen, Ziel, Kategorie, Tags und Projektbild bearbeiten

Projektaufgaben können ein Fälligkeitsdatum und einen Milestone erhalten. Ihr Fortschritt wird automatisch aus erledigten und offenen Aufgaben berechnet.

<img width="1898" height="928" alt="Chronos_Screenshot_3" src="https://github.com/user-attachments/assets/ad2ca07f-f7fa-4091-a5ab-862b382f095a" />

### Milestones

Milestones gehören immer zu einem bestimmten Projekt und enthalten:

- Titel
- Beschreibung
- Start- und Enddatum
- Status: „Geplant“, „Aktiv“ oder „Abgeschlossen“
- automatisch berechneten Aufgabenfortschritt

Beim Löschen eines Milestones kann gewählt werden, ob zugehörige Aufgaben erhalten und nur entkoppelt oder ebenfalls gelöscht werden sollen.

<img width="1900" height="917" alt="Chronos_Screenshot_4" src="https://github.com/user-attachments/assets/ad8053af-389f-4332-a125-afcd6453ae14" />

### Ressourcen und Projektbilder

Die Projektansicht enthält eine visuelle Ressourcenoberfläche mit:

- Bildergalerie
- Dokumentliste mit Dateiname, Typ, Größe und Datum
- Upload-Bereichen für Bilder und Dateien
- Projektbild-Auswahl und Entfernen des Projektbilds

Die Projektbilder können als lokale Bilddatei eingelesen und als Data-URL im Projekt gespeichert werden.

Die aktuellen Beispielbilder und Dokumente in der Ressourcenansicht sind statische Demo-Daten. Die Upload-Schaltflächen und Dateiablage sind noch nicht an eine persistente Dateiablage angebunden.

<img width="1898" height="932" alt="grafik" src="https://github.com/user-attachments/assets/838e6991-a602-457d-ab56-1f4f504bde8b" />

### Kategorien und Einstellungen

Unter „Einstellungen“ können globale Projektkategorien verwaltet werden.

- Standardkategorien beim ersten Start
- Kategorien hinzufügen
- Kategorien bearbeiten
- Kategorien löschen
- Kategorien werden bei der Projekterstellung und in den Projekteinstellungen angeboten

Die Navigation besteht aus Dashboard, Projekte und Einstellungen. Das Design verwendet ein dunkles, blau akzentuiertes Farbsystem mit responsiven Karten, Dialogen, Fortschrittsringen und klaren Fokuszuständen für Tastaturbedienung.

<img width="1900" height="924" alt="grafik" src="https://github.com/user-attachments/assets/bf475037-4d8f-4b65-bbeb-0887d755755d" />

## Technischer Aufbau

Chronos ist modular aufgebaut und trennt UI, Domain-Modelle, Hooks und Persistenz voneinander.

```text
src/
├── Components/
│   ├── Dashboard/          Tagesplan, Kalender, Aufgaben und Work Mode
│   ├── Projects/           Projektübersicht und Projektdetails
│   ├── Settings/           Globale Kategorienverwaltung
│   ├── Sidebar/            Hauptnavigation
│   └── ui/                 Wiederverwendbare UI-Komponenten
├── domain/                 Task-, Project- und Milestone-Modelle
├── hooks/                  Zustands- und Interaktionslogik
├── services/storage/       localStorage-Zugriff und ID-Erzeugung
├── Styles/                 CSS-Reset und Designvariablen
└── test/                   Test-Setup und Smoke-Test
```

### Verwendete Technologien

- React 19
- TypeScript
- Vite
- Vitest
- Testing Library
- ESLint
- Browser-APIs: `localStorage`, `FileReader` und Fullscreen API

### Datenmodell und Persistenz

Die wichtigsten Entitäten sind:

- **Task** – Aufgabe, Zeitfenster, Status, Wiederholung, investierte Zeit und optionale Projekt-/Milestone-Zuordnung
- **Project** – Name, Beschreibung, Ziel, Tags, Kategorie, Status, Zeitraum, Bild und Fortschritt
- **Milestone** – Projektzuordnung, Titel, Zeitraum, Status und daraus berechneter Aufgabenfortschritt
- **Category** – frei verwaltbare Projektkategorie

Gespeichert wird unter folgenden `localStorage`-Schlüsseln:

```text
chronos.tasks
chronos.projects
chronos.milestones
chronos.categories
```

Die Storage-Services behandeln fehlende oder beschädigte JSON-Werte defensiv. Ungültige Daten führen daher nicht zu einem Anwendungsabsturz, sondern werden als leere bzw. standardisierte Werte behandelt.

## Voraussetzungen

- Node.js und npm
- moderner Browser mit Unterstützung für ES-Module und die Fullscreen API

## Installation und Start

```bash
npm install
npm run dev
```

Danach ist die Entwicklungsanwendung über die von Vite ausgegebene lokale URL erreichbar.

## Verfügbare Skripte

```bash
npm run dev        # Entwicklungsserver starten
npm run build      # Produktions-Build erstellen
npm run preview    # Produktions-Build lokal anzeigen
npm run typecheck  # TypeScript prüfen
npm run lint       # ESLint ausführen
npm test           # Tests einmalig ausführen
npm run test:watch # Tests im Watch-Modus ausführen
```

## Tests und Qualitätssicherung

Die Tests decken unter anderem folgende Bereiche ab:

- Datums- und Zeitberechnungen
- Formatierung von Dauer und investierter Zeit
- Wiederholungslogik für Aufgaben
- Storage-Lesen und -Schreiben
- Verhalten bei beschädigten oder ungültigen Storage-Werten
- Projekt-Hilfsfunktionen
- grundlegende UI-Komponenten wie Dialoge, Buttons, Empty States und Fortschrittsringe

Die technischen Prüfungen können zusammen mit den folgenden Befehlen ausgeführt werden:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Aktueller Entwicklungsstand

Der zentrale Produktivitätsablauf ist implementiert: Aufgaben können geplant, wiederholt, bearbeitet, im Work Mode bearbeitet und mit investierter Zeit gespeichert werden. Auch Projekte, Projektaufgaben und Milestones verfügen über grundlegende CRUD-Funktionen.

Einige Bereiche sind derzeit noch visuelle Vorbereitungen oder Demo-Oberflächen:

- Die Suche, Statusfilter, Sortierung und alternative Karten-/Listenansicht in der Projektübersicht sind noch nicht vollständig interaktiv verdrahtet.
- Der Tab „Dokumentation“ zeigt derzeit nur einen Hinweis auf zukünftige Inhalte.
- Bildergalerie und Dokumentliste verwenden aktuell statische Beispieldaten.
- Datei-Uploads, Projekt-Export und Projektduplizierung sind noch nicht vollständig implementiert.
- Es gibt noch keine Benutzerverwaltung, Cloud-Synchronisierung oder serverseitige Datenbank.

## Lizenz

Die Lizenzinformationen befinden sich in der Datei [`LICENSE`](LICENSE).
