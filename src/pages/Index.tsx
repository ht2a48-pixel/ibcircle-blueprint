import { memo } from 'react';
import { Helmet } from 'react-helmet-async';
// Load Korean fonts only when the public (Korean-content) homepage renders
import '@/styles/korean-fonts';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Programs from '@/components/Programs';
import Consulting from '@/components/Consulting';
import Philosophy from '@/components/Philosophy';
import SampleReport from '@/components/SampleReport';
import Metrics from '@/components/Metrics';
import UniversityWall from '@/components/UniversityWall';
import FAQ from '@/components/FAQ';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

const Index = memo(() => {
  return (
    <>
      <Helmet>
        <title>IBCircle | 프리미엄 IB 교육 및 입시 컨설팅</title>
        <meta 
          name="description" 
          content="전 세계 명문대 출신 강사진들이 설립한 프리미엄 IB Diploma Programme 교육 및 글로벌 대학 입시 컨설팅 그룹. 맞춤형 1:1 수업과 전략적 입시 컨설팅을 제공합니다." 
        />
        <meta name="keywords" content="IB, IB Diploma, IB 수업, IB 과외, 입시 컨설팅, 대학 입시, 글로벌 대학, 미국 대학, 영국 대학" />
        <link rel="canonical" href="https://ibcirc.com" />
      </Helmet>

      <main className="min-h-screen bg-background">
        <Header />
        {/* Main page */}
        <Hero />
        {/* IB Diploma Programme - included in Programs */}
        {/* Personalized IB Coaching + Compact Exam Countdown */}
        <Programs />
        {/* Private Consulting Services */}
        <Consulting />
        {/* Our Philosophy */}
        <Philosophy />
        {/* Progress Report System Preview */}
        <SampleReport />
        {/* Statistics + Student location */}
        <Metrics />
        {/* Global University Acceptances */}
        <UniversityWall />
        {/* Frequently Asked Questions */}
        <FAQ />
        {/* Consultation & Contact */}
        <Contact />
        <Footer />
      </main>
    </>
  );
});

Index.displayName = "Index";

export default Index;