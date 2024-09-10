import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export const dynamic = 'force-static'; // 静的生成の指定

export default async function Timeline() {
  // Markdownファイルを取得して解析
  const files = fs.readdirSync(path.join('content/artworks'));
  const artworks = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join('content/artworks', filename),
      'utf-8'
    );
    const { data: frontMatter } = matter(markdownWithMeta);
    return {
      title: frontMatter.title,
      year: frontMatter.year,
      slug: filename.replace('.md', ''), // slugを生成
    };
  });

  return (
    <div>
      <h1>Artworks Timeline</h1>
      <ul>
        {artworks.map((artwork, index) => (
          <li key={index}>
            <strong>{artwork.year}:</strong>{" "}
            <Link href={`/artworks/${artwork.slug}`}>
              {artwork.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}