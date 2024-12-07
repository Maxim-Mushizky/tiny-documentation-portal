import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());

// Serve static files from the content directory
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
        const { q: query, mode = 'fuzzy' } = req.query;
        console.log('Search request:', { query, mode });

        const configPath = join(__dirname, 'src', 'content', 'qa-config.json');
        const configData = await readFile(configPath, 'utf8');
        const { sections } = JSON.parse(configData);

        const results = await Promise.all(
            sections.map(async (section, index) => {
                try {
                    const filePath = join(__dirname, 'src', 'content', section.path.replace('http://localhost:3001/content/', ''));
                    const content = await readFile(filePath, 'utf8');
                    const searchText = query.toLowerCase();

                    let matchesTitle = false;
                    let matchesContent = false;

                    if (mode === 'regex') {
                        try {
                            const regex = new RegExp(query, 'i');
                            matchesTitle = regex.test(section.title);
                            matchesContent = regex.test(content);
                        } catch (e) {
                            console.error('Invalid regex:', e);
                            matchesTitle = section.title.toLowerCase().includes(searchText);
                            matchesContent = content.toLowerCase().includes(searchText);
                        }
                    } else {
                        matchesTitle = section.title.toLowerCase().includes(searchText);
                        matchesContent = content.toLowerCase().includes(searchText);
                    }

                    if (matchesTitle || matchesContent) {
                        return {
                            title: section.title,
                            index,
                            matches: {
                                title: matchesTitle,
                                content: matchesContent
                            }
                        };
                    }
                } catch (error) {
                    console.error(`Error processing file for section ${section.title}:`, error);
                }
                return null;
            })
        );

        const filteredResults = results.filter(Boolean);
        res.json(filteredResults);
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).send('Error performing search');
    }
});

app.post('/api/qa/create', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { title } = req.body;
        const markdownFile = req.files.file;

        // Sanitize filename
        const sanitizedTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const filename = `${sanitizedTitle}.md`;
        const filePath = join(__dirname, 'src', 'content', filename);

        // Save the markdown file
        await markdownFile.mv(filePath);

        // Update qa-config.json
        const configPath = join(__dirname, 'src', 'content', 'qa-config.json');
        let config = { sections: [] };

        try {
            const configData = await readFile(configPath, 'utf-8');
            config = JSON.parse(configData);
        } catch (error) {
            console.warn('Config file not found, creating new one');
        }

        // Add new section
        config.sections.push({
            title: title,
            contentType: "file",
            path: `http://localhost:3001/content/${filename}`
        });

        // Write updated config
        await writeFile(configPath, JSON.stringify(config, null, 2));

        res.json({
            success: true,
            message: 'Q&A created successfully',
            path: `/content/${filename}`
        });

    } catch (error) {
        console.error('Error creating Q&A:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create Q&A',
            error: error.message
        });
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});