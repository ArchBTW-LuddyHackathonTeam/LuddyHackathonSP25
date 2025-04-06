import 'dotenv/config'
require('dotenv').config()

import { RAGApplicationBuilder } from '@llm-tools/embedjs';
import { OpenAiEmbeddings } from '@llm-tools/embedjs-openai';
import { OpenAi } from '@llm-tools/embedjs-openai';
import { WebLoader } from '@llm-tools/embedjs-loader-web';
import { HNSWDb } from '@llm-tools/embedjs-hnswlib';

export function queryPrompt(input: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const instructions = "You are an academic advisor. Use what you see as reference.";
      const fixedUrlContent = "https://scheduler.lillie.rs/classes/id/1";
      
      const ragApplication = await new RAGApplicationBuilder()
        .setModel(new OpenAi({ model: "gpt-3.5-turbo" }))
        .setEmbeddingModel(new OpenAiEmbeddings())
        .setVectorDatabase(new HNSWDb())
        .build();

      // Add more URLs here for reference if necessary
      await ragApplication.addLoader(new WebLoader({ urlOrContent: fixedUrlContent }));

      const queryString = `${instructions}\n\n${input}`;

      const result = await ragApplication.query(queryString);
      resolve(result.content);
    } catch (error) {
      reject(error);
    }
  });
}
