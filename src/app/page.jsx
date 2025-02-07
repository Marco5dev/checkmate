"use client";

import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import {
  faCheckCircle,
  faClock,
  faSync,
  faPalette,
  faTasks,
  faUser,
  faMoon,
  faStickyNote,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { signIn } from "next-auth/react";
import ImageGallery from "@/components/ImageGallery";
import { useInView } from "react-intersection-observer";

export default function Main() {
  const handleGithubSignIn = async () => {
    await signIn("github", { callbackUrl: "/home" });
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-base-300 via-base-100 to-primary/20"></div>
        <div className="hero-content relative z-10 flex-col gap-8 w-full">
          <div className="max-w-xl slide-in-left text-center">
            <h1 className="text-5xl font-bold animate-slideUp">
              Organize Your Life with CheckMate
            </h1>
            <p className="py-6 animate-slideUp animation-delay-200">
              A powerful task management application that helps you stay
              organized, focused, and productive. Built with modern technology
              and a user-first approach.
            </p>
            <div className="flex gap-4 animate-slideUp animation-delay-300 justify-center">
              <Link href="/login" className="btn btn-primary hover-scale">
                Get Started
              </Link>
              <button
                onClick={handleGithubSignIn}
                className="btn btn-outline hover-scale"
              >
                <FontAwesomeIcon icon={faGithub} className="mr-2 h-5 w-5" />
                Login with GitHub
              </button>
            </div>
          </div>
          <div className="w-[500px] slide-in-right">
            <div className="hover-lift">
              <ImageGallery />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <AnimatedTitle>Why Choose CheckMate?</AnimatedTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={faCheckCircle}
              title="Simple & Intuitive"
              description="Easy-to-use interface that helps you focus on what matters most - your tasks."
              delay={0}
            />
            <FeatureCard
              icon={faClock}
              title="Time Management"
              description="Organize tasks by priority and due dates to stay on top of your schedule."
              delay={200}
            />
            <FeatureCard
              icon={faSync}
              title="Sync Everywhere"
              description="Access your tasks from any device with real-time synchronization."
              delay={400}
            />
          </div>
        </div>
      </section>

      {/* Themes Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <TextBlock>
                <h2 className="text-4xl font-bold mb-6">Your Style, Your Way</h2>
                <p className="mb-6 text-lg">
                  Make CheckMate truly yours with extensive customization options:
                </p>
              </TextBlock>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faPalette} className="text-primary" />
                  <span>Multiple color themes to choose from</span>
                </li>
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faMoon} className="text-primary" />
                  <span>Light and dark mode support</span>
                </li>
                <li className="flex items-center gap-3">
                  <FontAwesomeIcon icon={faUser} className="text-primary" />
                  <span>Personalized workspace settings</span>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 hover-lift slide-in-right">
              <Image
                src="/previews/theme-preview.png"
                alt="Theme Customization"
                width={600}
                height={400}
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DetailCard
              icon={faTasks}
              title="Task Management"
              features={[
                "Create and organize tasks",
                "Set priorities and due dates",
                "Track task progress",
                "Categorize with labels",
              ]}
            />
            <DetailCard
              icon={faStickyNote}
              title="Notes & Documentation"
              features={[
                "Rich text editor",
                "File attachments",
                "Quick notes",
                "Markdown support",
              ]}
            />
            <DetailCard
              icon={faSearch}
              title="Smart Features"
              features={[
                "Powerful search",
                "Task filtering",
                "Custom categories",
                "Progress tracking",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-base-300">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Built for Everyone</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard number="100+" text="Customization Options" />
            <StatCard number="10+" text="Theme Variations" />
            <StatCard number="24/7" text="Cloud Sync" />
            <StatCard number="100%" text="Free to Use" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Get More Organized?
          </h2>
          <p className="mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their tasks more
            effectively with CheckMate. Start your journey to better
            productivity today.
          </p>
          <Link href="/login" className="btn btn-secondary btn-lg hover-scale">
            Start Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-base-300 text-base-content">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold hover-scale inline-block">
                Developer
              </h3>
              <p>Marco Essam</p>
              <a
                href="https://marco5dev.me"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                marco5dev.me
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Legal</h3>
              <div className="flex flex-col space-y-2">
                <Link href="/legal/terms" className="link link-hover">
                  Terms of Service
                </Link>
                <Link href="/legal/privacy" className="link link-hover">
                  Privacy Policy
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold">Connect</h3>
              <div className="flex space-x-4">
                <a
                  href="https://github.com/Marco5dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-primary transition-all hover:scale-125"
                >
                  <FontAwesomeIcon icon={faGithub} />
                </a>
                <a
                  href="https://twitter.com/Marco5_dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-primary transition-all hover:scale-125"
                >
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a
                  href="https://linkedin.com/in/marco5dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl hover:text-primary transition-all hover:scale-125"
                >
                  <FontAwesomeIcon icon={faLinkedin} />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-base-content/20 text-center">
            <p>
              © {new Date().getFullYear()} CheckMate. Developed by Marco Essam
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function AnimatedTitle({ children, className = "" }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <h2
      ref={ref}
      className={`text-4xl font-bold text-center mb-12 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

function FeatureCard({ icon, title, description, delay = 0 }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`card bg-base-200 shadow-xl hover-lift transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="card-body items-center text-center">
        <div className="text-primary mb-4 hover:scale-110 transition-transform">
          <FontAwesomeIcon icon={icon} className="w-8 h-8" />
        </div>
        <h3 className="card-title">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function DetailCard({ icon, title, features }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`card bg-base-200 shadow-xl hover-lift transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="card-body">
        <div className="text-primary mb-4 text-4xl">
          <FontAwesomeIcon icon={icon} />
        </div>
        <h3 className="card-title text-xl mb-4">{title}</h3>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-primary text-sm"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ number, text, delay = 0 }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`p-6 bg-base-200 rounded-lg hover-scale transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="text-4xl font-bold text-primary mb-2">{number}</div>
      <div className="text-base-content/80">{text}</div>
    </div>
  );
}

function TextBlock({ children }) {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}
