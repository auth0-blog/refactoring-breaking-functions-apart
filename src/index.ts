import axios from 'axios';
import { promises as fs } from 'fs';

type ApiResult = Array<{ meanings: Array<{ partOfSpeech: string }> }>;

async function isConjunctionFn(term: string) {
  const result = await axios.get<ApiResult>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`
  );

  const agg = result.data.flatMap(term => term.meanings.map(m => m.partOfSpeech));

  return agg.some(m => m === 'conjunction');
}

export async function processWord(
  word: string,
  isConjunction: (term: string) => Promise<boolean> = isConjunctionFn
) {
  if (word === 'and') {
    console.warn(`Consider removing the comma before '${word}'`);
    return true;
  } else {
    const isConjunctionTerm = await isConjunction(word);

    if (!isConjunctionTerm) {
      console.warn(`Consider adding a conjunction before '${word}'`);
    }
  }
}

async function program() {
  const data = await fs.readFile('./document.txt', 'utf-8');
  const words = data.split(' ');
  let acc = '';

  words.forEach(async word => {
    if (acc.endsWith(',')) processWord(word);

    acc = acc.concat(' ', word);
  }, '');
}

if (require.main === module) program();
