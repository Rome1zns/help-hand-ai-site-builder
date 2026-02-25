import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Бесплатный",
    price: "0 ₽",
    period: "навсегда",
    features: ["3 проекта", "Базовые шаблоны", "Поддомен helphand.app", "Экспорт кода"],
    featured: false,
  },
  {
    name: "Про",
    price: "990 ₽",
    period: "в месяц",
    features: ["Безлимит проектов", "Все шаблоны и ИИ-функции", "Свой домен", "Приоритетная поддержка", "Аналитика"],
    featured: true,
  },
  {
    name: "Команда",
    price: "2 490 ₽",
    period: "в месяц",
    features: ["Всё из Про", "До 10 участников", "Совместная работа", "Ролевой доступ", "SLA и выделенная поддержка"],
    featured: false,
  },
];

const Pricing = () => (
  <section id="pricing" className="py-24 px-4">
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Тарифы</h2>
        <p className="text-muted-foreground">Выберите план, который подходит вам</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`relative rounded-2xl p-6 flex flex-col ${
              plan.featured
                ? "glass-strong border-primary/40 glow-purple scale-[1.03]"
                : "glass"
            }`}
          >
            {plan.featured && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full bg-primary text-primary-foreground">
                Популярный
              </span>
            )}

            <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
            <div className="mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-muted-foreground ml-1">/ {plan.period}</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check size={16} className="text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${plan.featured ? "glow-purple" : ""}`}
              variant={plan.featured ? "default" : "secondary"}
            >
              {plan.price === "0 ₽" ? "Начать бесплатно" : "Выбрать план"}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Pricing;
