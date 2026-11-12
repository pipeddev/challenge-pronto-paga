import { createApp } from './app.ts';
import { env } from './config/env.ts';

createApp().listen(env.port, () => {
  console.log(`API escuchando en http://localhost:${env.port}`);
});
