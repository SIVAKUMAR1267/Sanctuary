import React from 'react';
import { Leaf, Shield, Wind, Sparkles, Key, Lock, Database, ArrowRight, Mail, Github, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-primary/20">
      <div className="absolute top-0 left-0 w-[100vw] md:w-[80vw] max-w-[800px] h-[600px] bg-primary/10 rounded-blob-1 blur-[100px] -translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
      <div className="absolute top-[30%] right-0 w-[100vw] md:w-[70vw] max-w-[600px] h-[800px] bg-secondary/10 rounded-blob-2 blur-[100px] translate-x-1/4 pointer-events-none"></div>

      <main className="relative z-10 pt-32 pb-24 md:pt-40 md:pb-32">
        
        {/* HERO: Scaled down text-4xl for mobile, text-7xl for desktop */}
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 mb-24 md:mb-48 relative">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 backdrop-blur-md border border-border/50 text-primary font-sans text-xs md:text-sm font-bold mb-6 md:mb-8 shadow-sm transition-transform hover:scale-105">
            <Sparkles size={16} />
            <span className="tracking-wide">Absolute privacy, naturally.</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-foreground leading-tight tracking-tight mb-6 md:mb-8">
            A quiet place for your <br className="hidden sm:block" />
            <span className="text-primary italic">deepest memories.</span>
          </h1>
          
          <p className="text-base md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto mb-10 md:mb-12 leading-relaxed px-2">
            Zero-knowledge encryption that feels as natural as planting a seed. 
            Your files are locked with keys only you hold. We can't see them, 
            we can't read them, and we can't share them.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 sm:px-0">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate('/register')}>
              Create Your Sanctuary
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => navigate('/login')}>
              Enter Existing
            </Button>
          </div>
        </div>

        {/* HOW IT WORKS: Reduced gap-8 for mobile, gap-12 for desktop */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-48 relative">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-4 tracking-tight">The Natural Order</h2>
            <p className="text-muted-foreground font-sans text-base md:text-lg">How we protect your files without ever seeing them.</p>
          </div>

          <div className="space-y-20 md:space-y-32 relative">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 group">
              <div className="flex-1 text-center md:text-right order-2 md:order-1">
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3 md:mb-4">1. The Seed is Sown</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-base md:text-lg">
                  When you enter the sanctuary, your browser generates a unique cryptographic keypair. This "seed" never leaves your device.
                </p>
              </div>
              <div className="flex-1 order-1 md:order-2 flex justify-center md:justify-start relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-white/60 backdrop-blur-sm border-2 border-primary/20 flex items-center justify-center shadow-soft transform -rotate-2 transition-all duration-700 group-hover:rotate-0 group-hover:scale-105 group-hover:bg-primary/5">
                  <Key className="w-10 h-10 md:w-12 md:h-12 text-primary" />
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 group">
              <div className="flex-1 flex justify-center md:justify-end">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-white/60 backdrop-blur-sm border-2 border-secondary/20 flex items-center justify-center shadow-float transform rotate-3 transition-all duration-700 group-hover:rotate-0 group-hover:scale-105 group-hover:bg-secondary/5">
                  <Lock className="w-10 h-10 md:w-12 md:h-12 text-secondary" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3 md:mb-4">2. The Weave</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-base md:text-lg">
                  Before a file is uploaded, it is broken into pieces and encrypted locally using your seed. It becomes unreadable noise.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 group">
              <div className="flex-1 text-center md:text-right order-2 md:order-1">
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-3 md:mb-4">3. Safely Planted</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-base md:text-lg">
                  The encrypted fragments are stored in our servers. Because we lack your local seed, the files remain permanently locked.
                </p>
              </div>
              <div className="flex-1 order-1 md:order-2 flex justify-center md:justify-start">
                <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-white/60 backdrop-blur-sm border-2 border-border/50 flex items-center justify-center shadow-soft transform -rotate-1 transition-all duration-700 group-hover:rotate-0 group-hover:scale-105 group-hover:bg-muted/50">
                  <Database className="w-10 h-10 md:w-12 md:h-12 text-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CORE CARDS */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 md:mb-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card asymmetric className="group cursor-default p-6 md:p-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 md:mb-6 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:-rotate-3">
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-primary transition-colors duration-500 group-hover:text-primary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2 md:mb-3">Absolute Silence</h3>
              <p className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
                Your files are woven with client-side cryptography before they ever leave your device. To the outside world, they are just noise in the wind.
              </p>
            </Card>

            <Card className="group cursor-default p-6 md:p-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-5 md:mb-6 transition-all duration-500 group-hover:bg-secondary group-hover:scale-110 group-hover:rotate-3">
                <Leaf className="w-6 h-6 md:w-7 md:h-7 text-secondary transition-colors duration-500 group-hover:text-secondary-foreground" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2 md:mb-3">The Sanctuary Seed</h3>
              <p className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
                You hold the only key—a unique seed generated in your browser. Without it, the memories cannot be unearthed.
              </p>
            </Card>

            <Card asymmetric className="group cursor-default p-6 md:p-10">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-border flex items-center justify-center mb-5 md:mb-6 transition-all duration-500 group-hover:bg-foreground group-hover:scale-110 group-hover:-rotate-3">
                <Wind className="w-6 h-6 md:w-7 md:h-7 text-foreground transition-colors duration-500 group-hover:text-background" />
              </div>
              <h3 className="text-xl md:text-2xl font-serif text-foreground mb-2 md:mb-3">Return to Earth</h3>
              <p className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed">
                When you delete a file, it is gone forever. No lingering traces, no hidden backups. It simply returns to the earth.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA: Reduced padding to p-8 on mobile, p-24 on desktop */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-blob-1 p-8 py-16 md:p-24 text-center relative overflow-hidden shadow-float transition-transform duration-700 hover:scale-[1.02]">
            <h2 className="text-3xl md:text-5xl font-serif text-primary-foreground mb-4 md:mb-6 relative z-10 tracking-tight">
              Ready to plant your roots?
            </h2>
            <p className="text-primary-foreground/90 font-sans text-base md:text-xl max-w-2xl mx-auto mb-8 md:mb-10 relative z-10 leading-relaxed">
              Join the sanctuary today. Experience military-grade cryptography wrapped in natural tranquility.
            </p>
            <Button 
              variant="ghost"
              size="lg" 
              className="!bg-white !text-primary hover:!bg-white/90 shadow-soft relative z-10 hover:shadow-float w-full sm:w-auto"
              onClick={() => navigate('/register')}
            >
              Get Started <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/50 bg-[#FEFEFA]/50 py-12 mt-20 md:mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <section className="py-8 md:py-12 relative z-10 flex flex-col items-center justify-center w-full">
            <div className="text-center mb-8 md:mb-10">
              <h2 className="text-2xl md:text-4xl font-serif font-bold mb-3 md:mb-4 tracking-tight text-foreground">
                Meet the Creator
              </h2>
              <p className="text-sm md:text-base text-muted-foreground max-w-md mx-auto leading-relaxed font-sans px-4">
                I built Sanctuary to explore zero-knowledge architecture and elegant web design.
              </p>
            </div>

            <div className="bg-white/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-6 md:p-10 shadow-soft w-full max-w-2xl flex flex-col items-center transition-all duration-500 hover:-translate-y-1 hover:shadow-float">
              <h3 className="text-xl md:text-2xl font-serif font-semibold mb-1 text-foreground">
                Sivakumar R
              </h3>
              <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-primary mb-6 md:mb-8 font-sans">
                Full Stack Developer
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full">
                <a href="mailto:rsivakumar1205o@gmail.com" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all duration-300 active:scale-95 shadow-soft">
                  <Mail size={18} />
                  <span className="font-sans font-bold">Email Me</span>
                </a>
                <a href="https://github.com/SIVAKUMAR1267" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-border text-foreground rounded-full hover:border-primary hover:text-primary transition-all duration-300 active:scale-95">
                  <Github size={18} />
                  <span className="font-sans font-bold">GitHub</span>
                </a>
                <a href="https://www.linkedin.com/in/sivakumar-r-webdev/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-border text-foreground rounded-full hover:border-primary hover:text-primary transition-all duration-300 active:scale-95">
                  <Linkedin size={18} />
                  <span className="font-sans font-bold">LinkedIn</span>
                </a>
              </div>
            </div>
          </section>

          <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-3 mt-8">
            <Leaf size={16} />
          </div>
          <p className="text-muted-foreground font-sans text-xs md:text-sm text-center">
            Crafted with zero-knowledge architecture.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;