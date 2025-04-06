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
    // .setModel(SIMPLE_MODELS.OPENAI_GPT4_O)
    .setEmbeddingModel(new OpenAiEmbeddings())
    .setVectorDatabase(new HNSWDb())
    .build();

//   await ragApplication.addLoader(new WebLoader({ urlOrContent: 'https://www.forbes.com/profile/elon-musk' }));
//   await ragApplication.addLoader(new WebLoader({ urlOrContent: 'https://en.wikipedia.org/wiki/Elon_Musk' }));
  await ragApplication.addLoader(new WebLoader({ urlOrContent: 'https://scheduler.lillie.rs/classes/id/1' }));
  

  const result = await ragApplication.query('tell me what you see now, what are the days available?');
  console.log(result);
})().catch((err: any) => console.error(err));

