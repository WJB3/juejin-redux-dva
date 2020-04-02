import dva from './dva';
import DvaLoading from './plugins/loading';

// 1. Initialize
const app = dva();

//2. Plugins
app.use(DvaLoading());

// 3. Model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
app.start('#root');
