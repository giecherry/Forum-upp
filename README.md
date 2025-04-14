
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