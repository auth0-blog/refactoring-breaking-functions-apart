import axios from 'axios';
import { promises as fs } from 'fs';
import { Suggestion, evalTerm, reducer, ApiResult } from './logic';

export const fetchDictionaryTerm = (term: string) =>
  axios
    .get<ApiResult>(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(term)}`)
    .then(r => r.data);

async function program() {
  const data = await fs.readFile('./document.txt', 'utf-8');
  const words = data.split(' ');

  async function evalRemoteTerm(suggestion: Suggestion): Promise<Suggestion> {
    const termResult = await fetchDictionaryTerm(suggestion.target);

    return evalTerm(suggestion, termResult);
  }

  const suggestions = await Promise.all<Suggestion>(
    words
      .reduce<Suggestion[]>(reducer, [])
      .map(suggestion => (suggestion.type === 'FETCH' ? evalRemoteTerm(suggestion) : suggestion))
  );

  suggestions.forEach(s =>
    console.warn(`Consider ${s.type === 'REMOVE' ? 'removing the comma in' : 'adding a conjunction after'} '${s.parent}'`)
  );
}

if (require.main === module) program();
