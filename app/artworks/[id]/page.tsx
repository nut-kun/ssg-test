import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Params {
    params: {
        id: string;
    };
}

export async function generateStaticParams() {
    const files = fs.readdirSync(path.join('content/artworks'));

    // .mdファイルのみをフィルタリング
    const markdownFiles = files.filter((file) => file.endsWith('.md'));

    return markdownFiles.map((filename) => ({
        id: filename.replace('.md', ''),  // .md拡張子を取り除いてidを生成
    }));
}

export default async function ArtworkDetails({ params }: Params) {
    const { id } = params;

    // ファイルパスの生成
    const filePath = path.join('content/artworks', `${id}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const { data: frontMatter, content } = matter(fileContents);

    return (
        <div>
            <h1>{frontMatter.title}</h1>
            <p><strong>Year:</strong> {frontMatter.year}</p>
            <div>{content}</div>
        </div>
    );
}