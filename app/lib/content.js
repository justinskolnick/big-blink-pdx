const fs = require('node:fs/promises');
const path = require('node:path');
const { marked } = require('marked');

const getContent = async (filename) => {
  const filepath = path.join(__dirname, '..', 'content', 'en', filename);

  try {
    await fs.access(filepath, fs.constants.R_OK);

    const data = await fs.readFile(filepath, { encoding: 'utf8' });

    return data;
  } catch (err) {
    return err;
  }
};

const getMarkdownContent = async (stem) => {
  const filename = `${stem}.md`;

  try {
    const content = await getContent(filename);

    if (content instanceof Error) {
      return content;
    }

    return marked.parse(content);
  } catch (err) {
    return err;
  }
};

module.exports = {
  getContent,
  getMarkdownContent,
};
