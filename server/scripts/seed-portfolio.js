// Usage: node scripts/seed-portfolio.js user@example.com
// Only initializes the named account if it already exists and its portfolio collections are empty.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Portfolio = require('../src/models/Portfolio');
const Skill = require('../src/models/Skill');
const Project = require('../src/models/Project');
const email = process.argv[2]?.toLowerCase();
if (!email) { console.error('Usage: node scripts/seed-portfolio.js user@example.com'); process.exit(1); }
(async () => {
  await mongoose.connect(process.env.DB_CONNECTION, { dbName: process.env.DB_NAME || 'cprg312_portfolio' });
  const user = await User.findOne({ email });
  if (!user) throw new Error('Account not found; register first.');
  const owner = user._id;
  if (!await Portfolio.exists({ owner })) {
    await Portfolio.create({ owner, name: user.username, title: 'I build for the web.',
      bio: 'Exploring thoughtful interfaces, reliable APIs, and secure web applications. I am studying Web Design & Development and exploring how visual design, code and secure engineering work together.',
      location: 'Calgary, Alberta', website: 'https://huitaoz.top',
      github: 'https://github.com/zhanght825/CPRG-312-A' });
  }
  if (!await Skill.exists({ owner })) {
    await Skill.insertMany([
      ['Vue.js','Frontend','Components, reactive state, and page navigation.'],
      ['HTML & CSS','Frontend','Accessible structure and responsive layouts.'],
      ['JavaScript','Frontend','Interactive behavior and API requests.'],
      ['Express','Backend','Routing, middleware, and JSON APIs.'],
      ['Web Security','Backend','HTTPS, Helmet, and security headers.'],
      ['HTTP Caching','Backend','Cache-Control, ETags, and revalidation.'],
      ['Nginx','Deployment','Reverse proxying and TLS configuration.'],
      ['GitHub Actions','Deployment','Automated builds and deployment workflows.'],
      ['Ubuntu & Vultr','Deployment','Cloud hosting and server administration.']
    ].map(([name, category, description], order) => ({ owner, name, category, description, order })));
  }
  if (!await Project.exists({ owner })) {
    await Project.create({ owner, title: 'Developer Portfolio', featured: true,
      description: 'A personal space to share my work and explore secure web development. Hosted on Vultr with Ubuntu and Nginx, with GitHub Actions deployment.',
      technologies: ['Vue 3','Vite','Express','Nginx','Certbot','MongoDB'],
      github: 'https://github.com/zhanght825/CPRG-312-A' });
  }
  console.log('Existing Phase 1 content imported for:', email);
})().catch(err => { console.error(err); process.exitCode = 1; }).finally(() => mongoose.disconnect());
