const app = require('./app');
const env = require('./config/env');
const paths = require('./utils/paths');
const { ensureDirs } = require('./utils/file');

async function bootstrap() {
  await ensureDirs([
    paths.tempDir,
    paths.extractDir,
    paths.outputDir
  ]);

  app.listen(env.port, () => {
    console.log(`${env.appName} running on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start app:', err);
  process.exit(1);
});