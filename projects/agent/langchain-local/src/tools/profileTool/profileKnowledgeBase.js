import { pipeline } from '@huggingface/transformers';
import { readFile } from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROFILE_FILE_PATH = path.join(__dirname, 'profile.md');
const EMBEDDING_MODEL = 'Xenova/paraphrase-multilingual-MiniLM-L12-v2';

function splitText(text, chunkSize = 100, chunkOverlap = 20) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    chunks.push(text.slice(start, end));

    if (end === text.length) {
      break;
    }

    start = Math.max(end - chunkOverlap, start + 1);
  }

  return chunks.filter((chunk) => chunk.trim().length > 0);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function tensorToVectors(tensor) {
  const { data, dims } = tensor;

  if (dims.length === 1) {
    return [Array.from(data)];
  }

  const [rows, cols] = dims;
  const vectors = [];

  for (let row = 0; row < rows; row += 1) {
    const start = row * cols;
    vectors.push(Array.from(data.slice(start, start + cols)));
  }

  return vectors;
}

let embeddingPipelinePromise;

async function getEmbeddingPipeline() {
  if (!embeddingPipelinePromise) {
    embeddingPipelinePromise = pipeline('feature-extraction', EMBEDDING_MODEL);
  }

  return embeddingPipelinePromise;
}

async function embedTexts(texts) {
  const extractor = await getEmbeddingPipeline();
  const output = await extractor(texts, {
    pooling: 'mean',
    normalize: true,
  });

  return tensorToVectors(output);
}

export async function createProfileKnowledgeBase() {
  console.log('Initializing profile knowledge base...');

  const rawText = await readFile(PROFILE_FILE_PATH, 'utf8');
  const chunks = splitText(rawText);
  const chunkVectors = await embedTexts(chunks);

  return {
    async search(query, topK = 3) {
      const [queryVector] = await embedTexts([query]);

      return chunks
        .map((chunk, index) => ({
          chunk,
          score: cosineSimilarity(queryVector, chunkVectors[index]),
        }))
        .sort((left, right) => right.score - left.score)
        .slice(0, topK)
        .map((item) => item.chunk);
    },
  };
}
