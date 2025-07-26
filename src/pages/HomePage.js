import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">Smart Learn</span>
          </h1>
          <p className="hero-subtitle">
            Your intelligent learning companion for personalized education and
            skill development
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <div className="card-icon">📚</div>
            <span>Learn</span>
          </div>
          <div className="floating-card card-2">
            <div className="card-icon">🎯</div>
            <span>Practice</span>
          </div>
          <div className="floating-card card-3">
            <div className="card-icon">🏆</div>
            <span>Achieve</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Smart Learn?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Personalized Learning</h3>
            <p>
              AI-powered recommendations tailored to your learning style and
              pace
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Progress Tracking</h3>
            <p>
              Monitor your learning journey with detailed analytics and insights
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Expert Content</h3>
            <p>
              Access high-quality educational materials from industry experts
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Start Your Learning Journey?</h2>
          <p>
            Join thousands of learners who are already transforming their skills
          </p>
          <Link to="/register" className="btn btn-primary btn-large">
            Start Learning Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
