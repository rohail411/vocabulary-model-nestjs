import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as brain from 'brain.js';

const stringSimilarity = require('string-similarity');
import { References } from './dto/scrape.dto';

const VOCAB_PATH = path.join(process.cwd(), 'vocabulary.json');

const MODEL_PATH = path.join(process.cwd(), 'model.json');

type VocabEntry = { word: string; definition: string; createdAt: string };

@Injectable()
export class ScrapeService {
  private net: any;

  constructor() {
    this.net = new brain.recurrent.LSTM();
    this.loadModel();
  }

  async scrapeAndTrain(url: string): Promise<{ message: string }> {
    const response: AxiosResponse<any> = await axios.get(url);
    if (response.status !== 200) {
      return {
        message: 'Failed to retrieve data',
      };
    }
    const data: Array<VocabEntry> = Object.values(
      response.data.references as References,
    )
      .filter((ref) => ref._type === 'Word')
      .map((wordRef) => ({
        word: wordRef.word,
        definition: wordRef.definition,
        createdAt: new Date().toISOString(),
      }));
    let existingData: string = '[]';
    if (fs.existsSync(VOCAB_PATH)) {
      existingData = fs.readFileSync(VOCAB_PATH, 'utf8');
    }
    const mergedData = [...JSON.parse(existingData), ...data];
    fs.writeFileSync(VOCAB_PATH, JSON.stringify(mergedData, null, 2));
    this.trainModel();
    return {
      message: 'Vocabulary scraped and model trained',
    };
  }

  getMeaning(word: string) {
    const raw = fs.readFileSync(VOCAB_PATH, 'utf8');
    const words = JSON.parse(raw);
    const wordList: Array<string> = words.map((entry) => entry.word);
    // Fuzzy match
    const bestMatchResult = stringSimilarity.findBestMatch(word, wordList);
    const bestMatch = bestMatchResult.bestMatch;
    const matchedWord = bestMatch.target;
    const similarity = bestMatch.rating;
    const output = this.net.run(matchedWord);
    const result: { error: boolean; word: string; meaning: string } = {
      error: false,
      word: matchedWord,
      meaning: output,
    };
    if (matchedWord !== word && similarity > 0.5) {
      result.error = true;
    }
    return result;
  }

  private trainModel() {
    const trainingData = this.trainingData();
    console.log('Training model...');
    this.net = new brain.recurrent.LSTM();
    this.net.train(trainingData, {
      iterations: 2000,
      log: true,
      logPeriod: 100,
      errorThresh: 0.011,
    });
    fs.writeFileSync(MODEL_PATH, JSON.stringify(this.net.toJSON(), null, 2));
  }

  private trainingData() {
    const raw = fs.readFileSync(VOCAB_PATH, 'utf8');
    const words: Array<VocabEntry> = JSON.parse(raw) as unknown as VocabEntry[];
    const trainingData = words.map((entry) => ({
      input: entry.word,
      output: entry.definition,
    }));
    return trainingData;
  }

  private loadModel() {
    if (fs.existsSync(MODEL_PATH)) {
      const json = JSON.parse(fs.readFileSync(MODEL_PATH, 'utf-8'));
      this.net.fromJSON(json);
    }
  }

  async getVocabulary(all: boolean): Promise<Array<string | VocabEntry>> {
    const raw = fs.readFileSync(VOCAB_PATH, 'utf8');
    const words: VocabEntry[] = JSON.parse(raw);
    if (all) {
      return words.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
    return words
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((entry) => entry.word)
      .slice(0, 10);
  }
}
