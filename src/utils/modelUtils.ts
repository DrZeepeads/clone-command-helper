import { pipeline } from "@huggingface/transformers";

let embeddingPipeline: any = null;

export const initializeModel = async () => {
  if (!embeddingPipeline) {
    console.log('🤖 Initializing DistilBERT model...');
    embeddingPipeline = await pipeline(
      "feature-extraction",
      "distilbert-base-uncased",
      { device: "cpu" }
    );
    console.log('✅ Model initialized successfully');
  }
  return embeddingPipeline;
};

export const getEmbeddings = async (text: string) => {
  const pipeline = await initializeModel();
  console.log('📝 Getting embeddings for:', text);
  const embeddings = await pipeline(text, {
    pooling: "mean",
    normalize: true,
  });
  return embeddings;
};