
# Felhantering i en NodeJS-applikation

### Scenario:

Du arbetar som backendutvecklare på ett företag som bygger en **forumapplikation** där användare kan skapa inlägg och kommentera på varandras inlägg. Under utvecklingen har det visat sig att applikationen ibland **kraschar** eller returnerar oväntade fel.

Du har nu i uppgift att säkerställa att:

- **All inkommande data valideras** strikt innan den sparas eller uppdateras i databasen.
- **Alla anrop till en specifik `Post` eller kommentar** hanterar fall där resursen inte finns och svarar med ett tydligt `404`meddelande.
- **Ingen route får krascha** applikationen, och vid fel ska API:t returnera tydliga och användbara felmeddelanden till frontend.

Nedan finns ett kodexempel. Skriv det som **best practice**-kod där en erfaren utvecklare enkelt förstår flödet. Använd gärna kommentarer, men bara om de tillför något. Kodens fokus ska ligga på **stabilitet**, **förutsägbarhet** och **användarvänlig felhantering**.

###
```
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.post('/posts', async (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body
  });
  const savedPost = await post.save();
  res.status(201).json(savedPost);
});

router.delete('/posts/:id', async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({ postId: post._id });
  res.json({ message: 'Inlägg och kommentarer borttagna' });
});

module.exports = router;

```
###