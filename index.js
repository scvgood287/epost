const app = require('./src');

app.set('port', process.env.PORT || 8081);

app.listen(app.get('port'), () => {
  console.log('Server Connected ', app.get('port') + ' port listening');
});
