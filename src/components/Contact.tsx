import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, Clock, Send, CheckCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message }
      });

      if (error) throw error;

      toast({
        title: "이메일이 전송되었습니다",
        description: "빠른 시일 내에 답변 드리겠습니다.",
      });
      
      setEmail('');
      setName('');
      setMessage('');
    } catch (error: any) {
      console.error('Error sending email:', error);
      toast({
        title: "전송 실패",
        description: "잠시 후 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
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

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Contact Methods */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* KakaoTalk Open Chat */}
              <a
                href="https://open.kakao.com/me/ibcircle"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-6 bg-secondary/50 border border-border hover:bg-secondary transition-colors duration-300 group"
              >
                <div className="w-12 h-12 bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">카카오톡 오픈채팅</p>
                  <p className="font-medium text-foreground">IBCircle 상담방</p>
                </div>
              </a>

              {/* Director Kakao ID */}
              <div className="flex items-center gap-4 p-6 bg-secondary/50 border border-border">
                <div className="w-12 h-12 bg-[#FEE500] text-[#3C1E1E] flex items-center justify-center flex-shrink-0">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">원장 카카오 ID</p>
                  <p className="font-medium text-foreground">Academythe</p>
                </div>
              </div>

              {/* Email contact info */}
              <a
                href="mailto:ht2a4.8@gmail.com"
                className="flex items-center gap-4 p-6 bg-secondary/50 border border-border hover:bg-secondary transition-colors duration-300 group"
              >
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">이메일</p>
                  <p className="font-medium text-foreground">ht2a4.8@gmail.com</p>
                </div>
              </a>

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

            {/* Right Column - Email Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-secondary/30 border border-border p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Send size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-foreground">이메일 문의</h3>
                  <p className="text-sm text-muted-foreground">자세한 상담 내용을 남겨주세요</p>
                </div>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    이름
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="홍길동"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    이메일
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    문의 내용
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-background border border-border focus:border-primary focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder="상담하고 싶은 내용을 자유롭게 작성해주세요."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-medium transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      전송 중...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      이메일 보내기
                    </>
                  )}
                </button>
              </form>

              <p className="text-xs text-muted-foreground mt-4 text-center">
                영업일 기준 24시간 이내 답변 드립니다.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;