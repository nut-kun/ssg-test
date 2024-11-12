import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './ArtworkDetails.module.css';
import { Metadata } from 'next';

interface Params {
    params: {
        id: string;
    };
}

// メタデータを動的に設定
export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { id } = params;

    const filePath = path.join('content/artworks', `${id}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter } = matter(fileContents);

    return {
        title: frontMatter.title + " | " + frontMatter.artist,
        description: `Details about ${frontMatter.title} - ${frontMatter.artist}`,
    };
}

export async function generateStaticParams() {
    const files = fs.readdirSync(path.join('content/artworks'));

    const markdownFiles = files.filter((file) => file.endsWith('.md'));

    return markdownFiles.map((filename) => ({
        id: filename.replace('.md', ''),
    }));
}

export default function ArtworkDetails({ params }: Params) {
    const { id } = params;
    const filePath = path.join('content/artworks', `${id}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter, content } = matter(fileContents);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{frontMatter.title}</h1>
            <p className={styles.artist}><strong>Artist:</strong> {frontMatter.artist}</p>
            <p className={styles.year}><strong>Year:</strong> {frontMatter.year}</p>
            <ReactMarkdown
                className={styles.markdown}
                remarkPlugins={[remarkGfm]}
                components={{
                    img: ({ node, ...props }) => <img {...props} className={styles.image} />,
                    a: ({ node, ...props }) => (
                        <a {...props} className={styles.link} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}