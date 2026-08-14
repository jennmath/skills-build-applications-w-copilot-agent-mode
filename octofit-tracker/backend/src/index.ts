import app from './server';

const port = Number(process.env.PORT ?? 8000);

app.listen(port, () => {
  console.log(`OctoFit Tracker backend is running on port ${port}`);
  console.log(
    `API base URL: ${process.env.CODESPACE_NAME ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev` : 'http://localhost:8000'}`,
  );
});
