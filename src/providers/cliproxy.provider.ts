import OpenAI from 'openai';
import { cliproxyConfig } from '../config/cliproxy.config';

export const CLIPROXY_PROVIDER = 'CLIPROXY_PROVIDER';

export const cliproxyProvider = {
  provide: CLIPROXY_PROVIDER,
  useFactory: () => {
    const config = cliproxyConfig();
    return new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseUrl,
    });
  },
};
