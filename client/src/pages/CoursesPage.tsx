import { useState } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import { EcosystemFooter } from '../components/EcosystemFooter';
import { 
  BookOpen, 
  Clock, 
  Target, 
  ArrowRight, 
  Filter,
  GraduationCap,
  CheckCircle,
  Star,
  Users,
  Zap,
  Award
} from 'lucide-react';
import { brandColors, animationVariants } from '../lib/ecosystem-design-system';

// Path Series Data
const pathSeriesData = [
  { 
    id: 'I',
    name: 'Foundations', 
    level: 'A1',
    price: 899,
    priceDisplay: '$899',
    duration: '4 weeks',
    hours: '30h',
    desc: 'Build core language fundamentals. Basic communication, presentations, essential emails.',
    focus: 'Basic workplace communication',
    tagline: 'From hesitation to essential communication',
    color: 'from-emerald-500 to-teal-600',
    features: ['Core grammar foundations', 'Basic vocabulary building', 'Simple presentations', 'Essential email writing'],
    popular: false,
  },
  { 
    id: 'II',
    name: 'Everyday Fluency', 
    level: 'A2',
    price: 899,
    priceDisplay: '$899',
    duration: '4 weeks',
    hours: '30h',
    desc: 'Daily interactions, informal conversations, oral comprehension.',
    focus: 'Everyday professional interactions',
    tagline: 'Confidence in daily workplace exchanges',
    color: 'from-teal-500 to-cyan-600',
    features: ['Conversational skills', 'Listening comprehension', 'Informal communication', 'Workplace small talk'],
    popular: false,
  },
  { 
    id: 'III',
    name: 'Operational French', 
    level: 'B1',
    price: 999,
    priceDisplay: '$999',
    duration: '4 weeks',
    hours: '35h',
    desc: 'Professional autonomy, report writing, meeting participation.',
    focus: 'Operational workplace tasks',
    tagline: 'Autonomy in professional contexts',
    color: 'from-blue-500 to-indigo-600',
    features: ['Report writing', 'Meeting participation', 'Professional emails', 'Workplace autonomy'],
    popular: true,
  },
  { 
    id: 'IV',
    name: 'Strategic Expression', 
    level: 'B2',
    price: 1099,
    priceDisplay: '$1,099',
    duration: '4 weeks',
    hours: '35h',
    desc: 'Strategic communication, argumentation, negotiation.',
    focus: 'Strategic communication skills',
    tagline: 'Mastering nuanced professional discourse',
    color: 'from-violet-500 to-purple-600',
    features: ['Argumentation skills', 'Negotiation techniques', 'Complex presentations', 'Strategic writing'],
    popular: false,
  },
  { 
    id: 'V',
    name: 'Professional Mastery', 
    level: 'C1',
    price: 1199,
    priceDisplay: '$1,199',
    duration: '4 weeks',
    hours: '40h',
    desc: 'Executive excellence, linguistic nuances, high-level presentations.',
    focus: 'Executive-level proficiency',
    tagline: 'Excellence at the executive level',
    color: 'from-purple-500 to-pink-600',
    features: ['Executive communication', 'Linguistic nuances', 'High-stakes presentations', 'Leadership language'],
    popular: false,
  },
  { 
    id: 'VI',
    name: 'SLE Exam Accelerator', 
    level: 'Exam Prep',
    price: 1299,
    priceDisplay: '$1,299',
    duration: '4 weeks',
    hours: '40h',
    desc: 'Intensive SLE exam preparation: reading, writing, oral.',
    focus: 'SLE exam success',
    tagline: 'Your final sprint to certification',
    color: 'from-amber-500 to-orange-600',
    features: ['SLE reading practice', 'SLE writing drills', 'Oral exam simulation', 'Mock exams included'],
    popular: true,
  },
];

// Filter options
const levelFilters = [
  { id: 'all', label: 'All Levels', description: 'View all courses' },
  { id: 'A1', label: 'A1', description: 'Beginner' },
  { id: 'A2', label: 'A2', description: 'Elementary' },
  { id: 'B1', label: 'B1', description: 'Intermediate' },
  { id: 'B2', label: 'B2', description: 'Upper Intermediate' },
  { id: 'C1', label: 'C1', description: 'Advanced' },
  { id: 'Exam Prep', label: 'Exam Prep', description: 'SLE Preparation' },
];

// Path images
const pathImages: Record<string, string> = {
  I: '/images/paths/path_a1_foundations.jpg',
  II: '/images/paths/path_a2_everyday.jpg',
  III: '/images/paths/path_b1_operational.jpg',
  IV: '/images/paths/path_b2_strategic.jpg',
  V: '/images/paths/path_c1_mastery.jpg',
  VI: '/images/paths/path_c2_exam.jpg',
};

// Course IDs mapping to Stripe products
const COURSE_IDS: Record<string, string> = {
  'I': 'path-i-foundations',
  'II': 'path-ii-everyday-fluency',
  'III': 'path-iii-operational-french',
  'IV': 'path-iv-strategic-expression',
  'V': 'path-v-professional-mastery',
  'VI': 'path-vi-sle-accelerator',
};

// Premium gradient
const premiumGradient = 'linear-gradient(135deg, #0D9488 0%, #7C3AED 100%)';

export default function CoursesPage() {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [enrollingCourse, setEnrollingCourse] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  const createCheckoutSession = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data: { url: string }) => {
      if (data.url) {
        toast.success('Redirecting to checkout...');
        window.open(data.url, '_blank');
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create checkout session');
      setEnrollingCourse(null);
    },
  });

  const handleEnroll = async (pathId: string) => {
    if (!isAuthenticated) {
      toast.info('Please log in to enroll in a course');
      window.location.href = getLoginUrl();
      return;
    }

    setEnrollingCourse(pathId);
    const courseId = COURSE_IDS[pathId];
    
    try {
      await createCheckoutSession.mutateAsync({
        productId: courseId,
        mode: 'payment',
      });
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setEnrollingCourse(null);
    }
  };

  // Filter courses based on selected level
  const filteredCourses = selectedLevel === 'all' 
    ? pathSeriesData 
    : pathSeriesData.filter(course => course.level === selectedLevel);

  return (
    <>
      <SEO 
        title="Courses | Path Series™ SLE Training"
        description="Explore our comprehensive Path Series™ courses designed for Canadian public servants. From A1 to C1, find the perfect course for your SLE certification journey."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section 
          className="relative py-20 lg:py-28 overflow-hidden"
          style={{ background: premiumGradient }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                <GraduationCap className="w-4 h-4" />
                Path Series™ Curriculum
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Find Your Perfect
                <span className="block mt-2 bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #5EEAD4 0%, #F472B6 100%)' }}>
                  Learning Path
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8">
                Structured courses designed specifically for Canadian public servants. 
                From beginner to advanced, achieve your SLE certification goals 3-4x faster.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center gap-8 mt-10">
                {[
                  { icon: Users, value: '2,500+', label: 'Public Servants' },
                  { icon: Zap, value: '3-4x', label: 'Faster Results' },
                  { icon: Award, value: '95%', label: 'Success Rate' },
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 text-white">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-white/80">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 border-b border-gray-100 bg-white sticky top-0 z-40 shadow-sm">
          <div className="container">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Filter className="w-5 h-5" />
                <span className="font-medium">Filter by Level:</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {levelFilters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedLevel(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedLevel === filter.id
                        ? 'text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={selectedLevel === filter.id ? { background: premiumGradient } : {}}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-16 lg:py-24">
          <div className="container">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLevel}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Popular Badge */}
                    {course.popular && (
                      <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-lg">
                          <Star className="w-3 h-3 fill-current" />
                          Popular
                        </div>
                      </div>
                    )}

                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={pathImages[course.id]}
                        alt={course.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop';
                        }}
                      />
                      <div 
                        className="absolute inset-0 opacity-60"
                        style={{ background: `linear-gradient(135deg, ${course.color.includes('emerald') ? '#10b981' : course.color.includes('teal') ? '#14b8a6' : course.color.includes('blue') ? '#3b82f6' : course.color.includes('violet') ? '#8b5cf6' : course.color.includes('purple') ? '#a855f7' : '#f59e0b'} 0%, transparent 100%)` }}
                      />
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-sm font-bold text-gray-800">
                          Path {course.id}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Level & Duration */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${course.color}`}>
                          {course.level}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <BookOpen className="w-4 h-4" />
                          {course.hours}
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{course.name}</h3>
                      <p className="text-sm text-teal-600 font-medium italic mb-3">"{course.tagline}"</p>
                      <p className="text-gray-600 text-sm mb-4">{course.desc}</p>

                      {/* Features */}
                      <div className="space-y-2 mb-6">
                        {course.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{course.priceDisplay}</p>
                          <p className="text-xs text-gray-500">CAD</p>
                        </div>
                        <button
                          onClick={() => handleEnroll(course.id)}
                          disabled={enrollingCourse === course.id}
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: premiumGradient }}
                        >
                          {enrollingCourse === course.id ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              Processing...
                            </>
                          ) : (
                            <>
                              Enroll Now
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* No Results */}
            {filteredCourses.length === 0 && (
              <div className="text-center py-16">
                <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                <p className="text-gray-500">Try selecting a different level filter</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-gray-50">
          <div className="container">
            <div 
              className="relative rounded-3xl p-8 lg:p-16 overflow-hidden"
              style={{ background: premiumGradient }}
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
              </div>

              <div className="relative z-10 text-center max-w-3xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Not Sure Which Path to Start?
                </h2>
                <p className="text-lg text-white/90 mb-8">
                  Book a free diagnostic session with our team. We'll assess your current level 
                  and recommend the perfect learning path for your SLE goals.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href="https://calendly.com/steven-barholere/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-white text-gray-900 hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
                  >
                    Book Free Diagnostic
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <Link
                    href="/rusingacademy"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-all hover:scale-105"
                  >
                    View All Programs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EcosystemFooter lang="en" theme="light" activeBrand="rusingacademy" />
      </div>
    </>
  );
}
