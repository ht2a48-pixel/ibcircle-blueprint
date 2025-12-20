import { motion } from 'framer-motion';
import { MessageCircle, Mail, Clock } from 'lucide-react';

const Contact = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      label: '카카오톡 상담',
      value: 'academythe',
      href: 'https://pf.kakao.com/_academythe',
    },
    {
      icon: Mail,
      label: '이메일',
      value: 'ht2a4.8@gmail.com',
      href: 'mailto:ht2a4.8@gmail.com',
    },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="section-title">Consultation & Contact</p>
            <h2 className="section-heading mb-6">상담 문의</h2>
            <p className="text-lg text-muted-foreground">
              무료 상담을 통해 맞춤형 학습 전략을 확인하세요.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact methods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {contactMethods.map((method) => (
                <a
                  key={method.label}
                  href={method.href}
                  className="flex items-center gap-4 p-6 bg-secondary/50 border border-border hover:bg-secondary transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <method.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{method.label}</p>
                    <p className="font-medium text-foreground">{method.value}</p>
                  </div>
                </a>
              ))}

              {/* Operating hours */}
              <div className="flex items-start gap-4 p-6 bg-secondary/50 border border-border">
                <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                  <Clock size={24} className="text-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">운영 시간</p>
                  <p className="text-sm text-foreground">평일 09:00–22:00</p>
                  <p className="text-sm text-foreground">주말 10:00–18:00</p>
                </div>
              </div>
            </motion.div>

            {/* CTA Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-primary text-primary-foreground p-8 md:p-10 flex flex-col justify-center"
            >
              <h3 className="text-2xl font-medium mb-4">
                무료 상담 신청
              </h3>
              <p className="text-primary-foreground/80 mb-8 leading-relaxed">
                학생의 현재 상황과 목표에 맞는 최적의 학습 전략을 
                무료 상담을 통해 확인하세요.
              </p>
              <a
                href="https://pf.kakao.com/_academythe"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary font-medium transition-all duration-300 hover:opacity-90"
              >
                카카오톡으로 상담하기
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
