
# Felhantering i en NodeJS-applikation

### Scenario:

Du arbetar som backendutvecklare på ett företag som bygger en **forumapplikation** där användare kan skapa inlägg och kommentera på varandras inlägg. Under utvecklingen har det visat sig att applikationen ibland **kraschar** eller returnerar oväntade fel.

Du har nu i uppgift att säkerställa att:

- **All inkommande data valideras** strikt innan den sparas eller uppdateras i databasen.
- **Alla anrop till en specifik `Thread` eller kommentar** hanterar fall där resursen inte finns och svarar med ett tydligt `404`meddelande.
- **Ingen route får krascha** applikationen, och vid fel ska API:t returnera tydliga och användbara felmeddelanden till frontend.

Nedan finns ett kodexempel. Skriv det som **best practice**-kod där en erfaren utvecklare enkelt förstår flödet. Använd gärna kommentarer, men bara om de tillför något. Kodens fokus ska ligga på **stabilitet**, **förutsägbarhet** och **användarvänlig felhantering**.

###
```
const express = require('express');
const router = express.Router();
const Thread = require('../models/Thread');

router.thread('/thread', async (req, res, next) => {
  const thread = new Thread({
    title: req.body.title,
    content: req.body.body
  });
  const savedThread = await thread.save();
  res.status(201).json(savedThread);
});

router.delete('/threads/:id', async (req, res, next) => {
  const thread = await Thread.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ threadId: thread._id });
  res.json({ message: 'Thread och kommentarer borttagna' });
});

module.exports = router;

```
###

## Projektbeskrivning och Utmaningar

Under arbetet med denna forumapplikation har jag fokuserat på att bygga en stabil och användarvänlig backend som uppfyller kraven för felhantering och datavalidering. Här är en sammanfattning av vad jag har gjort och de utmaningar jag stött på:

### Vad jag har gjort:
- Implementerat **validering av inkommande data** för att säkerställa att endast korrekt formaterad data sparas i databasen. Detta inkluderar:
  - Kontroll av längd och närvaro för fält som `title` och `content` i trådar.
  - Kontroll av längd och närvaro för `content` i kommentarer.
  - Säkerställt att alla anrop till specifika resurser (trådar och kommentarer) hanterar fall där resursen inte finns och returnerar ett tydligt `404`-felmeddelande.
  - Implementerat **autentisering och auktorisering** för att skydda API:et:
  - Endast inloggade användare kan skapa, uppdatera eller ta bort trådar och kommentarer.
  - Endast författaren till en tråd eller kommentar kan uppdatera eller ta bort den.
  - Använt **try-catch** i alla routes för att förhindra att applikationen kraschar vid oväntade fel.
  - Returnerat tydliga och användbara felmeddelanden till frontend för att förbättra användarupplevelsen.

### Utmaningar:
- **Frontend vs Backend**: 
  - Ursprungligen planerade jag att bygga både frontend och backend för applikationen. Men under projektets gång insåg jag att det skulle bli svårt att hinna med båda delarna och samtidigt säkerställa att backend uppfyller alla krav.
  - Jag valde därför att fokusera helt på backendutvecklingen för att leverera en stabil och välfungerande API-lösning.
- **Felhantering**:
  - Att hantera olika typer av fel (t.ex. saknade resurser, valideringsfel, och serverfel) på ett konsekvent sätt var en utmaning. Jag löste detta genom att använda tydliga felmeddelanden och loggning för att underlätta felsökning.
- **Databasrelationer**:
  - Att hantera relationer mellan trådar, kommentarer och användare krävde noggrann användning av Mongoose-metoder som `.populate()` och `.findByIdAndUpdate()`.

### Slutsats:
Genom att fokusera på backendutvecklingen har jag kunnat säkerställa att API:et är stabilt, förutsägbart och användarvänligt. Jag har lärt mig mycket om felhantering, autentisering och datavalidering i Node.js och Mongoose, och jag är nöjd med resultatet av projektet.

---

## Hur man kör applikationen

1. **Installera beroenden**:
   ```
   npm install
   ```

2. **Starta servern**:
   ```
  npm run dev
   ```

3. **API-dokumentation**:

  GET /api-docs

  Denna route returnerar en JSON-struktur med detaljerad information om alla endpoints, inklusive vilka som kräver autentisering och deras syfte.

## Framtida förbättringar

- **Frontend**: Bygga en frontend för att visualisera och interagera med API:et.
- **Testning**: Skriva enhetstester och integrationstester för att säkerställa att API:et fungerar som förväntat.

---
