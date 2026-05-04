import { Link } from 'react-router-dom';
import { useTheme } from '../store/ThemeContext';
import { useState, useEffect } from 'react';
import { 
  Zap, Shield, BarChart3, Users, Package, Clock, CheckCircle, ArrowRight, Star,
  Monitor, Smartphone, Database, Lock, Sparkles, Rocket, Globe, Award, ChevronRight, Check
} from 'lucide-react';

const Landing = () => {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: BarChart3, title: 'Financial Dashboard', desc: 'Real-time insights into your business performance with customizable reports and AI-powered predictions' },
    { icon: Users, title: 'CRM Module', desc: 'Manage contacts, leads, and deals with our intuitive Kanban pipeline view' },
    { icon: Package, title: 'Inventory Management', desc: 'Track stock levels, products, and orders in one central hub with barcode scanning' },
    { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security with encrypted data storage and SOC2 compliance' },
    { icon: Monitor, title: 'Modern Interface', desc: 'Clean, intuitive design with dark/light mode that your team will love' },
    { icon: Smartphone, title: 'Mobile Ready', desc: 'Access your ERP from any device, anywhere with our native mobile apps' },
    { icon: Rocket, title: 'AI-Powered Analytics', desc: 'Machine learning insights to predict trends and optimize your business decisions' },
    { icon: Globe, title: 'Multi-Company', desc: 'Manage multiple entities and subsidiaries from a single dashboard' }
  ];

  const plans = [
    { 
      name: 'Starter', 
      price: 29, 
      users: 'Up to 5 users', 
      features: ['Dashboard Analytics', 'CRM Module', 'Inventory', 'Basic Accounting'],
      color: 'primary'
    },
    { 
      name: 'Professional', 
      price: 99, 
      users: 'Up to 25 users', 
      features: ['All Starter features', 'HR Module', 'Projects', 'Advanced Reports', 'AI Analytics'], 
      popular: true,
      color: 'accent'
    },
    { 
      name: 'Enterprise', 
      price: 299, 
      users: 'Unlimited users', 
      features: ['All Professional', 'Priority Support', 'Custom Integrations', 'White-label', 'Dedicated Account Manager'],
      color: 'platinum'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '99.9%', label: 'Uptime' },
    { value: '150+', label: 'Countries' },
    { value: '4.9/5', label: 'User Rating' }
  ];

  const testimonials = [
    { 
      name: 'Sarah Johnson', 
      role: 'Operations Manager', 
      company: 'TechStart Inc.', 
      avatar: 'S',
      text: 'JenQ ERP transformed how we manage our business. The intuitive interface made adoption easy for our team. ROI was visible within 3 months!',
      rating: 5 
    },
    { 
      name: 'Michael Chen', 
      role: 'CEO', 
      company: 'GrowthLabs', 
      avatar: 'M',
      text: 'The best investment we made this year. Our processes are now streamlined and efficient. The AI insights are game-changing.',
      rating: 5 
    },
    { 
      name: 'Emily Rodriguez', 
      role: 'Finance Director', 
      company: 'MediCare Plus', 
      avatar: 'E',
      text: 'Finally, an ERP that actually delivers on its promises. The multi-company feature saved us countless hours.',
      rating: 5 
    },
    { 
      name: 'David Kim', 
      role: 'CTO', 
      company: 'InnovateTech', 
      avatar: 'D',
      text: 'The API integrations and automation features are phenomenal. Our team can focus on what matters - growing the business.',
      rating: 5 
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isDark 
          ? scrolled ? 'bg-slate-950/95 backdrop-blur-md border-slate-800' : 'bg-transparent'
          : scrolled ? 'bg-white/95 backdrop-blur-md border-slate-200' : 'bg-transparent'
      } ${scrolled ? 'border-b' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>JenQ ERP</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Features</a>
              <a href="#pricing" className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Pricing</a>
              <a href="#testimonials" className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Testimonials</a>
            </nav>
            <div className="flex items-center gap-3">
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {isDark ? <Rocket size={18} /> : <Zap size={18} />}
              </button>
              <Link to="/login" className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>Sign In</Link>
              <Link 
                to="/register" 
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/30"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </header>

      <section className={`pt-32 pb-20 relative overflow-hidden ${
        isDark 
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-primary-50'
      }`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full opacity-20 ${
            isDark ? 'bg-primary-500 blur-3xl' : 'bg-primary-100 blur-3xl'
          }`} />
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 ${
            isDark ? 'bg-accent-500 blur-3xl' : 'bg-accent-100 blur-3xl'
          }`} />
</div>
         
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/20">
              <Sparkles size={16} className="text-primary-500" />
              <span className="text-sm text-primary-500 font-medium">Now with AI-powered insights</span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-bold leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              The Modern ERP for
              <span className="bg-gradient-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent"> Growing Businesses</span>
            </h1>
            <p className={`text-xl mt-6 max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Streamline your operations, boost productivity, and make smarter decisions with JenQ ERP - the complete business management solution with AI-powered analytics.
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <Link 
                to="/register" 
                className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 transition-all shadow-xl shadow-primary-500/30 text-base font-medium"
              >
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <Link 
                to="/login" 
                className={`flex items-center gap-2 px-8 py-4 rounded-lg border transition-colors text-base font-medium ${
                  isDark 
                    ? 'border-slate-700 text-white hover:bg-slate-800' 
                    : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                View Demo
              </Link>
            </div>
            <div className={`flex items-center justify-center gap-6 mt-8 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-accent-500" />
                <span className="text-sm">14 days free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-accent-500" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-accent-500" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl border-4 ${
              isDark ? 'border-slate-700' : 'border-slate-200'
            }`}>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop" 
                alt="ERP Dashboard Preview"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white text-sm font-medium">Real-time analytics dashboard with AI insights</p>
              </div>
            </div>
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-2xl shadow-xl ${
              isDark ? 'bg-slate-800' : 'bg-white'
            } border ${isDark ? 'border-slate-700' : 'border-slate-200'} flex items-center justify-center`}>
              <Sparkles size={32} className="text-primary-500" />
</div>
          </div>
        </div>
      </section>

      <section className={`py-16 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${
                  i === 0 ? 'from-primary-500 to-primary-600' :
                  i === 1 ? 'from-accent-500 to-accent-600' :
                  i === 2 ? 'from-premium-platinum to-indigo-500' :
                  'from-premium-gold to-yellow-500'
                } bg-clip-text text-transparent`}>
                  {stat.value}
                </div>
                <div className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Everything You Need to Run Your Business
            </h2>
            <p className={`text-lg mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Powerful features designed for modern enterprises with AI-powered insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-xl group ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 hover:border-primary-500' 
                    : 'bg-slate-50 border-slate-200 hover:border-primary-300 hover:bg-white'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-lg mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative rounded-2xl p-8 border transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? isDark 
                      ? 'bg-gradient-to-br from-primary-900/50 to-accent-900/50 border-primary-500' 
                      : 'bg-white ring-2 ring-primary-500'
                    : isDark 
                      ? 'bg-slate-800 border-slate-700' 
                      : 'bg-white border-slate-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-medium rounded-full shadow-lg shadow-primary-500/30">
                    Most Popular
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                    plan.color === 'primary' ? 'from-primary-500 to-primary-600' :
                    plan.color === 'accent' ? 'from-accent-500 to-accent-600' :
                    'from-premium-platinum to-indigo-600'
                  } flex items-center justify-center shadow-lg`}>
                    <Award size={20} className="text-white" />
                  </div>
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${plan.price}</span>
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>/month</span>
                </div>
                <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.users}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={18} className="text-accent-500" />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/register" 
                  className={`mt-8 block w-full text-center py-3 rounded-lg font-medium transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:shadow-lg hover:shadow-primary-500/30' 
                      : isDark 
                        ? 'bg-slate-700 text-white hover:bg-slate-600' 
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className={`py-20 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Loved by Teams Worldwide
            </h2>
            <p className={`text-lg mt-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              See what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, i) => (
              <div 
                key={i} 
                className={`p-6 rounded-xl border ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800' 
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className={`text-sm italic ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>"{testimonial.text}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{testimonial.name}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{testimonial.role}, {testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-500 via-premium-platinum to-accent-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-white/80 mt-4">
            Start your free 14-day trial today. No credit card required.
          </p>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-2 mt-8 px-8 py-4 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-xl"
          >
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className={`py-12 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-900'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-lg font-bold text-white">JenQ ERP</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
            </div>
            <p className="text-sm text-slate-400">2024 JenQ ERP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;