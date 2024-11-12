import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { Metadata } from "next";
import styles from './Timeline.module.css'; // Ensure this is the correct path

export const dynamic = 'force-static';

export const generateMetadata = (): Metadata => {
  return {
    title: "Timeline",
    description: "Artworks timeline",
  };
};

export default async function Timeline() {
  const files = fs.readdirSync(path.join('content/artworks'));
  const artworks = files.map((filename) => {
    const markdownWithMeta = fs.readFileSync(
      path.join('content/artworks', filename),
      'utf-8'
    );
    const { data: frontMatter } = matter(markdownWithMeta);
    return {
      title: frontMatter.title,
      artist: frontMatter.artist,
      year: frontMatter.year,
      image: frontMatter.image,
      slug: filename.replace('.md', ''),
    };
  });

  artworks.sort((a, b) => Number(b.year) - Number(a.year)); // Sorting artworks by year in descending order

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Artworks Timeline</h1>
      <ul className={styles.list}>
        {artworks.map((artwork, index) => (
          <li key={index} className={styles.listItem}>
            {artwork.year}{" "}
            <Link href={`/artworks/${artwork.slug}`} legacyBehavior>
              <a><strong>{artwork.title}</strong> - {artwork.artist}</a>
            </Link>
            <img src={artwork.image} alt={artwork.title} className={styles.previewImage} />
          </li>
        ))}
      </ul>
    </div>
  );
}