const app = require('./app');

const PORT = Number(process.env.PORT || 5000);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;
