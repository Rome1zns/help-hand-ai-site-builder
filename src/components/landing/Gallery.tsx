import { motion } from "framer-motion";

const projects = [
  { title: "Кофейня «Арома»", category: "Лендинг", color: "from-amber-900/40 to-amber-700/20" },
  { title: "Портфолио Марии", category: "Портфолио", color: "from-pink-900/40 to-pink-700/20" },
  { title: "TechStore", category: "Магазин", color: "from-blue-900/40 to-blue-700/20" },
  { title: "Фитнес-клуб", category: "Бизнес", color: "from-green-900/40 to-green-700/20" },
  { title: "Блог путешественника", category: "Блог", color: "from-orange-900/40 to-orange-700/20" },
  { title: "Студия дизайна", category: "Агентство", color: "from-purple-900/40 to-purple-700/20" },
];

const Gallery = () => (
  <section id="gallery" className="py-24 px-4">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Примеры сайтов</h2>
        <p className="text-muted-foreground">Созданы на Help Hand за считанные секунды</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group glass rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 cursor-pointer"
          >
            <div className={`h-48 bg-gradient-to-br ${p.color} flex items-center justify-center`}>
              <div className="w-3/4 space-y-2 p-4">
                <div className="w-full h-3 rounded bg-white/10" />
                <div className="w-2/3 h-3 rounded bg-white/10" />
                <div className="w-1/3 h-6 rounded-md bg-white/15 mt-4" />
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="font-medium text-sm">{p.title}</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary">{p.category}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Gallery;
