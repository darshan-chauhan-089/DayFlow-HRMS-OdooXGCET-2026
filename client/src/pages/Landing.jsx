import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaRocket, FaShieldAlt, FaChartLine, FaUsers, FaClock, FaFileAlt } from 'react-icons/fa';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Glassmorphism Header */}
      <header className="glass-header sticky-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="DayFlow HRMS" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>DayFlow HRMS</span>
          </div>
          <nav className="flex gap-6 items-center">
            <Link to="/login" className="text-sm font-semibold hover:text-[#714B67] transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Login
            </Link>
            <Link to="/signup" className="odoo-btn-primary">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section - Split Layout */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Typography */}
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-2 rounded-full mb-6">
            <FaRocket className="text-[#714B67]" />
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--odoo-purple)' }}>
              Enterprise HR Management
            </span>
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-main)' }}>
            Streamline Your
            <span className="block bg-gradient-to-r from-[#714B67] to-[#00A09D] text-transparent bg-clip-text">
              HR Operations
            </span>
          </h1>
          <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            A complete HRMS solution with attendance tracking, employee management, and automated workflows. Built for teams that value efficiency and professionalism.
          </p>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="odoo-btn-primary">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/signup" className="odoo-btn-primary flex items-center gap-2">
                  <FaRocket />
                  Get Started Free
                </Link>
                <Link to="/login" className="odoo-btn-secondary">
                  Login →
                </Link>
              </>
            )}
          </div>
          
          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold" style={{ color: 'var(--odoo-purple)' }}>99.9%</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: 'var(--odoo-teal)' }}>50K+</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Employees</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: 'var(--odoo-purple)' }}>24/7</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Support</div>
            </div>
          </div>
        </div>

        {/* Right: Dashboard Mockup */}
        <div className="relative">
          <div className="odoo-card p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <FaChartLine className="text-[#714B67]" />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase" style={{ color: 'var(--text-secondary)' }}>Dashboard Overview</div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>Real-time Analytics</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-32 bg-gradient-to-r from-purple-50 to-teal-50 rounded" style={{ borderRadius: 'var(--radius-sm)' }} />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-20 bg-purple-50 rounded" style={{ borderRadius: 'var(--radius-sm)' }} />
                <div className="h-20 bg-teal-50 rounded" style={{ borderRadius: 'var(--radius-sm)' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Cards */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-main)' }}>Everything You Need</h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Powerful features designed for modern HR teams</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: FaUsers, title: 'Employee Management', desc: 'Centralized employee database with custom fields and role-based access' },
              { icon: FaClock, title: 'Attendance Tracking', desc: 'Automated time tracking with biometric integration and leave management' },
              { icon: FaFileAlt, title: 'Document Automation', desc: 'Generate payslips, contracts, and reports with one click' },
              { icon: FaShieldAlt, title: 'Security First', desc: 'Enterprise-grade encryption with JWT authentication and audit logs' },
              { icon: FaChartLine, title: 'Analytics Dashboard', desc: 'Real-time insights with customizable reports and data visualization' },
              { icon: FaRocket, title: 'Quick Deployment', desc: 'Cloud-ready with automated backups and seamless integrations' }
            ].map((feature, idx) => (
              <div key={idx} className="odoo-card p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded bg-purple-50 flex items-center justify-center mb-4">
                  <feature.icon className="text-xl text-[#714B67]" />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-main)' }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>
            Ready to Transform Your HR?
          </h2>
          <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
            Join thousands of companies using DayFlow HRMS for efficient workforce management
          </p>
          {!isAuthenticated && (
            <Link to="/signup" className="odoo-btn-primary inline-flex items-center gap-2">
              <FaRocket />
              Start Free Trial
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8" style={{ borderColor: 'var(--border-color)' }}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            © 2026 DayFlow HRMS by OdooXGCET. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
