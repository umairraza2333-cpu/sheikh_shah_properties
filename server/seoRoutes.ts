import { Router } from 'express';
import { generateSitemap, generateRobots } from './sitemap';

const router = Router();

/**
 * Sitemap route - returns sitemap.xml
 */
router.get('/sitemap.xml', async (req, res) => {
  try {
    const sitemap = await generateSitemap();
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

/**
 * Robots.txt route
 */
router.get('/robots.txt', (req, res) => {
  try {
    const robots = generateRobots();
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    res.status(500).send('Error generating robots.txt');
  }
});

export default router;
