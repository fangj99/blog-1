import { Router } from 'express';
import { getAllArticles, getSingleArticle } from '../lib/get-archives';

var router = Router();

router.get('/all_articles', (req, res) => {
  getAllArticles().then((articles) => {
    res.send({entities: articles});
  });
});

router.post('/single_article', (req, res) => {
  getSingleArticle(req.body.name).then((article) => {
    res.send({article: article});
  });
});

export default router;
