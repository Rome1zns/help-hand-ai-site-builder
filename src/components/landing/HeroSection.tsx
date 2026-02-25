import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const examples = [
  "Лендинг для кофейни",
  "Сайт строительной компании",
  "Интернет-магазин",
  "Блог о путешествиях",
];

const stats = [
  { value: "1 000+", label: "сайтов создано" },
  { value: "50+", label: "шаблонов" },
  { value: "30 сек", label: "среднее время" },
];

const HeroSection = () => {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleGenerate = () => {
    navigate("/editor", { state: { prompt } });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs text-muted-foreground mb-8">
            <Sparkles size={14} className="text-primary" />
            Конструктор сайтов на базе ИИ
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-gradient max-w-4xl mx-auto">
            Создайте сайт за 30 секунд с помощью ИИ
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Опишите свой проект — и получите готовый сайт. Без кода, без дизайнера, без ожидания.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative glass-strong rounded-2xl p-1.5 glow-purple">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Опишите сайт, который хотите создать..."
                className="flex-1 bg-transparent border-none outline-none px-4 py-4 text-foreground placeholder:text-muted-foreground text-sm md:text-base"
              />
              <Button size="lg" className="rounded-xl shrink-0" onClick={handleGenerate}>
                <ArrowRight size={18} />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex)}
                className="text-xs px-4 py-2 rounded-full glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
              >
                {ex}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-8 mt-12">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
