import { pipeline } from "@huggingface/transformers";

let embeddingPipeline: any = null;
let qaPipeline: any = null;

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

export const initializeQAModel = async () => {
  if (!qaPipeline) {
    console.log('🤖 Initializing RoBERTa QA model...');
    qaPipeline = await pipeline(
      "question-answering",
      "deepset/roberta-base-squad2",
      { device: "cpu" }
    );
    console.log('✅ QA Model initialized successfully');
  }
  return qaPipeline;
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

export const getQuestionAnswer = async (question: string, context: string) => {
  const pipeline = await initializeQAModel();
  console.log('❓ Getting answer for question:', question);
  console.log('📚 Using context:', context);
  const result = await pipeline(question, context);
  return result;
};