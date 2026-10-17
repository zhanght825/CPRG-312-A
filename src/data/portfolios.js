// Public display content only. Replace example project/notes with verified work.
// The URLs use a GET query parameter: ?name=huitao or ?name=cheska.
const repository = 'https://github.com/zhanght825/CPRG-312-A'

export const profiles = {
  huitao: {
    slug: 'huitao',
    name: 'Huitao Zhang',
    initials: 'HZ',
    label: 'Developer Portfolio',
    headline: ['Building thoughtful', 'web experiences.'],
    intro: 'I am studying Web Design & Development, exploring how visual design, code, and secure engineering work together.',
    bio: 'This portfolio is a place to share selected work and document my learning in web design and development. Real projects and verified details will be added as the course progresses.',
    portrait: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=960&q=85',
    portraitAlt: 'Illustrative stock portrait of a man; not Huitao Zhang',
    focus: ['Vue 3 & JavaScript', 'HTML & CSS', 'Responsive web design', 'Node.js & Express', 'Git & deployment', 'Web security'],
    projects: [
      { id: 'portfolio', index: '01', type: 'Web Development', title: 'Secure Portfolio Platform', description: 'A course project exploring responsive design, HTTPS, secure APIs and caching strategies.', tags: ['Vue 3', 'Vite', 'Security'], image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85', href: repository, sample: false },
      { id: 'dashboard', index: '02', type: 'Concept · Example', title: 'Developer Dashboard Concept', description: 'An illustrative interface concept; replace this entry with a completed project.', tags: ['UI Design', 'JavaScript'], image: 'https://images.unsplash.com/photo-1585076641399-5c06d1b3365f?auto=format&fit=crop&w=1000&q=85', href: '', sample: true },
    ],
    notes: [
      { tag: 'WEB SECURITY', title: 'Understanding HTTPS & TLS', description: 'A planned learning note about encrypted web connections.', sample: true },
      { tag: 'DEVELOPMENT', title: 'From Git Push to Deployment', description: 'A planned note on building and publishing Vue applications.', sample: true },
    ],
  },
  cheska: {
    slug: 'cheska',
    name: 'Francheska Agaton',
    initials: 'FA',
    label: 'Designer & Developer Portfolio',
    headline: ['Designing for people.', 'Creating for the web.'],
    intro: 'I am studying Web Design & Development and building a portfolio of creative, accessible, and useful digital experiences.',
    bio: 'This personal portfolio will showcase web design and development work as it becomes available. Project samples below are clearly identified until replaced with real work.',
    portrait: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=960&q=85',
    portraitAlt: 'Illustrative stock portrait of a woman; not Francheska Agaton',
    focus: ['Web design', 'Responsive layouts', 'HTML & CSS', 'JavaScript', 'User experience', 'Team collaboration'],
    projects: [
      { id: 'portfolio', index: '01', type: 'Web Development', title: 'Secure Portfolio Platform', description: 'A shared course project for practicing front-end design and secure web architecture.', tags: ['Vue 3', 'Responsive', 'Collaboration'], image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85', href: repository, sample: false },
      { id: 'studio', index: '02', type: 'Concept · Example', title: 'Creative Studio Website', description: 'An illustrative responsive website concept; replace with an actual design or development project.', tags: ['Design', 'CSS', 'Layout'], image: 'https://images.unsplash.com/photo-1585076641399-5c06d1b3365f?auto=format&fit=crop&w=1000&q=85', href: '', sample: true },
    ],
    notes: [
      { tag: 'DESIGN', title: 'Designing Consistent Interfaces', description: 'A planned article on typography, spacing and reusable components.', sample: true },
      { tag: 'LEARNING', title: 'Our Web Development Workflow', description: 'A planned note about working as a two-person development team.', sample: true },
    ],
  },
}

export const teamLinks = [
  { slug: 'huitao', name: profiles.huitao.name, portrait: profiles.huitao.portrait, portraitAlt: profiles.huitao.portraitAlt, description: 'Web design, development & secure web experiences' },
  { slug: 'cheska', name: profiles.cheska.name, portrait: profiles.cheska.portrait, portraitAlt: profiles.cheska.portraitAlt, description: 'Web design, responsive interfaces & creative development' },
]
