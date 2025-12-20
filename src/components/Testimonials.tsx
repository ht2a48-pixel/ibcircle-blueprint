import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  result?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "IBCircle의 체계적인 수업 덕분에 IB 41점을 받을 수 있었습니다. 특히 EE와 TOK 지도가 정말 도움이 되었어요.",
    author: "김○○",
    role: "졸업생 / 현 University of Pennsylvania 재학",
    result: "IB 41점"
  },
  {
    quote: "단순히 시험 준비가 아닌, 학습 전략 전체를 설계해주셨습니다. 매주 받는 리포트로 진행 상황을 명확히 파악할 수 있었습니다.",
    author: "박○○ 학부모",
    role: "11학년 학부모",
  },
  {
    quote: "선생님들이 직접 IB를 경험하셨기 때문에 실질적인 조언을 받을 수 있었습니다. IA 작성 방향부터 시험 전략까지 모든 것이 체계적이었어요.",
    author: "이○○",
    role: "졸업생 / 현 Cornell University 재학",
    result: "IB 39점"
  },
  {
    quote: "3특 전형 준비를 IBCircle과 함께 했습니다. 입시 전략부터 에세이까지 전문적인 컨설팅 덕분에 목표 대학에 합격했습니다.",
    author: "최○○",
    role: "졸업생 / 현 서울대학교 재학",
    result: "서울대 합격"
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 md:py-32 bg-secondary/20">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-title">Student & Parent Testimonials</p>
          <h2 className="section-heading">학생 및 학부모 후기</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background border border-border p-8 relative group hover:shadow-lg transition-shadow duration-300"
            >
              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-8 h-8 text-muted/30 group-hover:text-primary/20 transition-colors" />
              
              {/* Quote text */}
              <p className="text-foreground leading-relaxed mb-6 text-[15px]">
                "{testimonial.quote}"
              </p>
              
              {/* Author info */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
                
                {testimonial.result && (
                  <div className="bg-primary/10 px-3 py-1.5 rounded">
                    <span className="text-sm font-medium text-primary">{testimonial.result}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
