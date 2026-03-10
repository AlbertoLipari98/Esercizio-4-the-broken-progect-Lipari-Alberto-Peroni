# 🏦 Lipari Branch Search — Broken Edition

Progetto Angular 19 standalone per la ricerca di filiali bancarie.
**Contiene 3 bug intenzionali** da identificare e correggere.

---

## 🚀 Avvio

```bash
npm install && ng serve
```

Apri il browser su `http://localhost:4200`

---

## 🗂 Struttura progetto

```
src/app/
├── app.component.ts / .html
├── app.config.ts
└── features/branches/
    ├── models/branch.model.ts
    ├── services/branch.service.ts
    └── components/branch-search/
        ├── branch-search.component.ts
        ├── branch-search.component.html
        └── branch-search.component.scss
```

---

## 🎯 MISSIONE 1 — Il campo di ricerca è troppo "chiacchierone"

### Sintomi
- Apri il **Network tab** di DevTools (o guarda la console).
- Digita lentamente la parola `Milano` lettera per lettera.
- Osserva quante chiamate al servizio vengono effettuate.
- Confronta con il comportamento atteso: una ricerca dovrebbe partire
  solo dopo che l'utente ha smesso di digitare per un breve momento.

### Cosa aspettarti nella versione corretta
Digitando `M`, `Mi`, `Mil`, `Mila`, `Milan`, `Milano` in rapida sequenza
dovrebbe partire **una sola richiesta** (o pochissime), non sei.

### Hint per il debugging
- Cerca nella pipe di `searchTerm$` gli operatori RxJS che controllano
  la frequenza delle emissioni.
- Quale operatore introduce un "ritardo d'attesa" prima di far passare
  un valore?
- Qual è il valore attuale del parametro di quell'operatore?

---

## 🎯 MISSIONE 2 — I risultati arrivano nell'ordine sbagliato

### Sintomi
1. Digita `Mi` nella barra di ricerca → appare lo spinner.
2. Prima che i risultati arrivino, cancella e digita `Milano`.
3. I risultati di `Milano` appaiono brevemente... poi vengono **sovrасcritti**
   dai risultati di `Mi` (più vecchi ma con latenza maggiore).
4. La lista finale mostra dati che **non corrispondono** all'ultima query digitata.

### Cosa aspettarti nella versione corretta
Solo i risultati dell'**ultima** query devono essere visualizzati.
Tutte le richieste precedenti devono essere automaticamente cancellate
quando arriva una nuova query.

### Hint per il debugging
- Apri `branch-search.component.ts` e trova la pipe di `vm$`.
- Osserva quale operatore RxJS viene usato per "appiattire" l'Observable
  interno restituito da `branchService.searchBranches()`.
- Esistono due varianti comuni di questo operatore: una **accumula** tutte
  le risposte in-flight, l'altra **cancella** la precedente appena arriva
  una nuova emissione. Quale dei due è quello corretto per una ricerca?
- Guarda anche `branch.service.ts`: nota le latenze diverse per query
  corte vs lunghe. Perché sono state messe lì?

---

## 🎯 MISSIONE 3 — Il componente lascia "fantasmi" in memoria

### Sintomi
- Il bug non è visibile a prima vista nell'UI.
- Apri la **console** del browser: noti dei log `[analytics] vm changed: ...`
  che continuano ad apparire.
- Se navighi via dal componente (distruggi e ricrea il componente più volte),
  i log si **moltiplicano**: al secondo mount ne vedi il doppio, al terzo
  il triplo.
- Con strumenti come Chrome **Memory profiler** o `ngDebug` potresti
  vedere subscription attive che non vengono mai rilasciate.

### Cosa aspettarti nella versione corretta
Quando il componente viene distrutto, **tutte le subscription** devono
essere automaticamente cancellate. Zero memory leak.

### Hint per il debugging
- Cerca in `branch-search.component.ts` tutti i punti dove viene chiamato
  `.subscribe()`.
- Per ognuno, verifica se esiste un meccanismo di cleanup:
  `unsubscribe()`, `takeUntil()`, `takeUntilDestroyed()`.
- Angular 16+ offre un'utility built-in per gestire il ciclo di vita
  delle subscription. Come si chiama? Quale `inject()` token richiede?
- Cerca anche nella pipe di `searchTerm$`: è presente `takeUntilDestroyed`?

---

