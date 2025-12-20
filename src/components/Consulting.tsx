import { motion } from 'framer-motion';
import { Globe, FileText, Users } from 'lucide-react';

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
    <section id="consulting" className="py-24 md:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <p className="text-xs font-medium tracking-[0.2em] uppercase opacity-60 mb-4">
            Private Consulting Services
          </p>
          <h2 className="text-3xl md:text-4xl font-medium leading-tight mb-8">
            입시 컨설팅
          </h2>
          <blockquote className="text-lg md:text-xl opacity-80 leading-relaxed">
            "IBCIRCLE의 컨설팅은 정보 제공이 아닌,
            <br className="hidden md:block" />
            입시 전반을 설계하는 전략적 파트너십입니다."
          </blockquote>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-primary-foreground/5 border border-primary-foreground/10 p-8"
            >
              <div className="w-12 h-12 bg-primary-foreground/10 flex items-center justify-center mb-6">
                <service.icon size={24} />
              </div>
              <h3 className="text-xl font-medium mb-2">{service.title}</h3>
              <p className="text-primary-foreground/70 mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.details.map((detail) => (
                  <li key={detail} className="flex items-center gap-3 text-sm text-primary-foreground/80">
                    <div className="w-1 h-1 bg-primary-foreground/50 rounded-full" />
                    {detail}
                  </li>
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
