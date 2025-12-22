import { motion } from 'framer-motion';
import { Globe, FileText } from 'lucide-react';

const Consulting = () => {
  const services = [
    {
      icon: Globe,
      title: '글로벌 명문대 지원',
      description: '미국, 영국, 아시아 주요 대학 지원 전략',
      details: ['에세이 전략 수립', '활동 설계', '인터뷰 준비'],
    },
    {
      icon: FileText,
      title: '국내 특별전형',
      description: '3특 / 12특 지원 전략',
      details: ['지원 자격 분석', '전체 일정 관리', '서류 전략'],
    },
  ];

  return (
    <section id="consulting" className="py-24 md:py-32 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative elements */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.05 }}
        viewport={{ once: true }}
        className="absolute top-0 right-0 w-96 h-96 rounded-full border border-primary-foreground/20"
        style={{ transform: 'translate(30%, -30%)' }}
      />
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full border border-primary-foreground/20"
        style={{ transform: 'translate(-30%, 30%)' }}
      />
      
      <div className="container mx-auto px-6 lg:px-12 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 0.6, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs font-medium tracking-[0.2em] uppercase mb-4"
          >
            Private Consulting Services
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-medium leading-tight mb-8"
          >
            입시 컨설팅
          </motion.h2>
          <motion.blockquote 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 0.8, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl leading-relaxed"
          >
            "IBCIRCLE의 컨설팅은 정보 제공이 아닌,
            <br className="hidden md:block" />
            입시 전반을 설계하는 전략적 파트너십입니다."
          </motion.blockquote>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-primary-foreground/5 border border-primary-foreground/10 p-8 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.15 }}
                className="w-12 h-12 bg-primary-foreground/10 flex items-center justify-center mb-6"
              >
                <service.icon size={24} />
              </motion.div>
              <h3 className="text-xl font-medium mb-2 text-primary-foreground">{service.title}</h3>
              <p className="text-primary-foreground/70 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.details.map((detail, detailIndex) => (
                  <motion.li 
                    key={detail} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.5 + detailIndex * 0.1 }}
                    className="flex items-center gap-3 text-sm text-primary-foreground/80"
                  >
                    <div className="w-1 h-1 bg-primary-foreground/50 rounded-full" />
                    {detail}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Consulting;
