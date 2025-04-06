import dotenv from 'dotenv';
dotenv.config();

import { RAGApplicationBuilder } from '@llm-tools/embedjs';
import { OpenAiEmbeddings } from '@llm-tools/embedjs-openai';
import { OpenAi } from '@llm-tools/embedjs-openai';
import { WebLoader } from '@llm-tools/embedjs-loader-web';
import { HNSWDb } from '@llm-tools/embedjs-hnswlib';

(async () => {
  const ragApplication = await new RAGApplicationBuilder()
    .setModel(new OpenAi({ model: "gpt-3.5-turbo" }))
    .setEmbeddingModel(new OpenAiEmbeddings())
    .setVectorDatabase(new HNSWDb())
    .build();

  await ragApplication.addLoader(new WebLoader({ urlOrContent: 'https://scheduler.lillie.rs/classes/id/1' }));
  
  const result = await ragApplication.query('tell me everything you see now in detail');
  console.log(result);
})().catch((err: any) => console.error(err));

