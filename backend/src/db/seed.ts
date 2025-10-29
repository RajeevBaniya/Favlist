import dotenv from 'dotenv';
import { prisma } from './client.js';
import { logger } from '../utils/logger.js';
import sampleData from './sample-data.json' assert { type: 'json' };

dotenv.config();

type EntryType = 'MOVIE' | 'TV_SHOW';

interface SampleEntry {
  title: string;
  type: EntryType;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
}

const sampleEntries: SampleEntry[] = sampleData as SampleEntry[];

// Generate more entries to reach 200+ for infinite scroll testing
const generateMoreEntries = (): typeof sampleEntries => {
  const additionalEntries = [];
  const titles = ['The Matrix', 'Avatar', 'Titanic', 'The Godfather', 'Forrest Gump', 'The Avengers'];
  const directors = ['Wachowski Brothers', 'James Cameron', 'Francis Ford Coppola', 'Robert Zemeckis', 'Joss Whedon'];
  const locations = ['Los Angeles', 'New York', 'London', 'Paris', 'Tokyo', 'Sydney'];

  for (let i = 0; i < 200; i++) {
    additionalEntries.push({
      title: `${titles[i % titles.length]} ${Math.floor(i / titles.length) + 1}`,
      type: i % 2 === 0 ? ('MOVIE' as const) : ('TV_SHOW' as const),
      director: directors[i % directors.length],
      budget: `$${(i + 1) * 10} million`,
      location: locations[i % locations.length],
      duration: i % 2 === 0 ? `${120 + (i % 60)} min` : `${40 + (i % 20)} min/episode`,
      yearTime: i % 2 === 0 ? `${2000 + (i % 24)}` : `${2000 + (i % 20)}-${2005 + (i % 20)}`,
    });
  }

  return additionalEntries;
};

async function seed(): Promise<void> {
  try {
    logger.info('Starting database seed...');

    // Clear existing data
    await prisma.entry.deleteMany({});
    logger.info('Cleared existing entries');

    // Insert sample entries
    await prisma.entry.createMany({
      data: sampleEntries,
    });
    logger.info(`Created ${sampleEntries.length} sample entries`);

    // Insert additional entries for testing infinite scroll
    const moreEntries = generateMoreEntries();
    await prisma.entry.createMany({
      data: moreEntries,
    });
    logger.info(`Created ${moreEntries.length} additional entries for testing`);

    const totalCount = await prisma.entry.count();
    logger.info(`Total entries in database: ${totalCount}`);
    
    logger.info('Database seed completed successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed();

