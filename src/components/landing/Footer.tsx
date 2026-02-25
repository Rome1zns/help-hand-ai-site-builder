const Footer = () => (
  <footer className="border-t border-white/5 py-12 px-4">
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
      <a href="#" className="text-lg font-bold">
        Help <span className="text-primary">Hand</span>
      </a>

      <div className="flex gap-6 text-sm text-muted-foreground">
        <a href="#gallery" className="hover:text-foreground transition-colors">Примеры</a>
        <a href="#pricing" className="hover:text-foreground transition-colors">Тарифы</a>
        <a href="#" className="hover:text-foreground transition-colors">Документация</a>
      </div>

      <p className="text-xs text-muted-foreground">© 2026 Help Hand. Все права защищены.</p>
    </div>
  </footer>
);

export default Footer;
