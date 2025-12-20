import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="py-16 bg-foreground text-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Logo */}
          <div className="text-2xl font-medium tracking-tight mb-8">
            IBCircle
          </div>

          {/* Tagline */}
          <p className="text-lg text-background/80 leading-relaxed mb-12">
            IBCircle는 수업만을 제공하지 않습니다.
            <br />
            결과에 이르는 과정을 설계합니다.
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm">
            <a href="#programs" className="text-background/60 hover:text-background transition-colors">
              프로그램
            </a>
            <a href="#results" className="text-background/60 hover:text-background transition-colors">
              성과
            </a>
            <a href="#consulting" className="text-background/60 hover:text-background transition-colors">
              컨설팅
            </a>
            <a href="#insights" className="text-background/60 hover:text-background transition-colors">
              인사이트
            </a>
            <a href="#contact" className="text-background/60 hover:text-background transition-colors">
              상담
            </a>
          </div>

          {/* Divider */}
          <div className="w-24 h-px bg-background/20 mx-auto mb-8" />

          {/* Copyright */}
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} IBCircle. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
