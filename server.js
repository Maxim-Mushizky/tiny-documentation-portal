import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());

// Cache for markdown content
let contentCache = new Map();

// Function to load and cache content
async function loadContent(filePath) {
    if (contentCache.has(filePath)) {
        return contentCache.get(filePath);
    }
    const content = await readFile(filePath, 'utf8');
    contentCache.set(filePath, content);
    return content;
}

app.use('/content', express.static(join(__dirname, 'src', 'content')));

app.get('/api/config', async (req, res) => {
    try {
        const configPath = join(__dirname, 'src', 'content', 'qa-config.json');
        const data = await readFile(configPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (err) {
        res.status(404).send('Config file not found');
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q.toLowerCase();
        const configPath = join(__dirname, 'src', 'content', 'qa-config.json');
        const configData = await readFile(configPath, 'utf8');
        const { sections } = JSON.parse(configData);

        const results = await Promise.all(
            sections.map(async (section, index) => {
                const filePath = join(__dirname, section.path.replace('http://localhost:3001', ''));
                const content = await loadContent(filePath);
                const matchesTitle = section.title.toLowerCase().includes(query);
                const matchesContent = content.toLowerCase().includes(query);

                if (matchesTitle || matchesContent) {
                    return {
                        ...section,
                        index,
                        matches: {
                            title: matchesTitle,
                            content: matchesContent
                        }
                    };
                }
                return null;
            })
        );

        res.json(results.filter(Boolean));
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).send('Error performing search');
    }
});

app.get('/content/:filename', async (req, res) => {
    try {
        const filePath = join(__dirname, 'src', 'content', req.params.filename);
        const data = await loadContent(filePath);
        res.send(data);
    } catch (err) {
        res.status(404).send('File not found');
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});