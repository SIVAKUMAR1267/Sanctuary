import React from 'react';
import { Leaf, Shield, Wind, Sparkles, Key, Lock, Database, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-primary/20">
      
     
      <main className="relative z-10 pt-20 pb-32 md:pt-32">
        
        {/* --- SECTION 1: HERO --- */}
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 mb-32 md:mb-48">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-sans text-sm font-bold mb-8 shadow-sm">
            <Sparkles size={16} />
            <span>Absolute privacy, naturally.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif text-foreground leading-tight tracking-tight mb-8">
            A quiet place for your <br className="hidden md:block" />
            <span className="text-primary italic">deepest memories.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-sans max-w-2xl mx-auto mb-12 leading-relaxed">
            Zero-knowledge encryption that feels as natural as planting a seed. 
            Your files are locked with keys only you hold. We can't see them, 
            we can't read them, and we can't share them.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate('/register')}>
              Create Your Sanctuary
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
              Enter Existing
            </Button>
          </div>
        </div>

        {/* --- SECTION 2: HOW IT WORKS (The Journey) --- */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 md:mb-48">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif text-foreground mb-4">The Natural Order</h2>
            <p className="text-muted-foreground font-sans text-lg">How we protect your files without ever seeing them.</p>
          </div>

          <div className="space-y-24">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 md:text-right order-2 md:order-1">
                <h3 className="text-3xl font-serif text-foreground mb-4">1. The Seed is Sown</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                  When you enter the sanctuary, your browser generates a unique cryptographic keypair. This "seed" never leaves your device. We have zero knowledge of it.
                </p>
              </div>
              <div className="flex-1 order-1 md:order-2 flex justify-center md:justify-start">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] bg-primary/10 border-2 border-primary/20 flex items-center justify-center shadow-soft transform -rotate-2">
                  <Key size={48} className="text-primary" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 flex justify-center md:justify-end">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[60%_40%_30%_70%_/_60%_30%_70%_40%] bg-secondary/10 border-2 border-secondary/20 flex items-center justify-center shadow-soft transform rotate-3">
                  <Lock size={48} className="text-secondary" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-serif text-foreground mb-4">2. The Weave</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                  Before a file is uploaded, it is broken into pieces and encrypted locally using your seed. It becomes unreadable noise to anyone who might intercept it.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 md:text-right order-2 md:order-1">
                <h3 className="text-3xl font-serif text-foreground mb-4">3. Safely Planted</h3>
                <p className="text-muted-foreground font-sans leading-relaxed text-lg">
                  The encrypted fragments are stored in our servers. Because we lack your local seed, the files remain permanently locked until you return to retrieve them.
                </p>
              </div>
              <div className="flex-1 order-1 md:order-2 flex justify-center md:justify-start">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-muted border-2 border-border/50 flex items-center justify-center shadow-soft transform -rotate-1">
                  <Database size={48} className="text-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION 3: CORE PHILOSOPHY CARDS --- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-32 md:mb-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card asymmetric className="group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-500 text-primary">
                <Shield size={28} />
              </div>
              <h3 className="text-2xl font-serif text-foreground mb-3">Absolute Silence</h3>
              <p className="text-muted-foreground font-sans leading-relaxed">
                Your files are woven with client-side cryptography before they ever leave your device. To the outside world, they are just noise in the wind.
              </p>
            </Card>

            <Card className="group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:text-white transition-colors duration-500 text-secondary">
                <Leaf size={28} />
              </div>
              <h3 className="text-2xl font-serif text-foreground mb-3">The Sanctuary Seed</h3>
              <p className="text-muted-foreground font-sans leading-relaxed">
                You hold the only key—a unique seed generated in your browser. Without it, the memories cannot be unearthed.
              </p>
            </Card>

            <Card asymmetric className="group hover:-translate-y-2 transition-transform duration-500">
              <div className="w-14 h-14 rounded-2xl bg-muted text-foreground flex items-center justify-center mb-6 group-hover:bg-foreground group-hover:text-white transition-colors duration-500">
                <Wind size={28} />
              </div>
              <h3 className="text-2xl font-serif text-foreground mb-3">Return to Earth</h3>
              <p className="text-muted-foreground font-sans leading-relaxed">
                When you delete a file, it is gone forever. No lingering traces, no hidden backups. It simply returns to the earth.
              </p>
            </Card>
          </div>
        </div>

        {/* --- SECTION 4: FINAL CTA (Deep Grounding Color) --- */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-float">
            {/* Subtle texture inside the CTA */}
            <div className="absolute inset-0 opacity-[0.05] mix-blend-multiply pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
            
            <h2 className="text-4xl md:text-5xl font-serif text-primary-foreground mb-6 relative z-10">
              Ready to plant your roots?
            </h2>
            <p className="text-primary-foreground/80 font-sans text-lg md:text-xl max-w-2xl mx-auto mb-10 relative z-10">
              Join the sanctuary today. Experience military-grade cryptography wrapped in natural tranquility.
            </p>
            <Button 
              variant='outline'
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-soft relative z-10"
              onClick={() => navigate('/register')}
            >
              Get Started <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        </div>

      </main>

      {/* --- SIMPLE FOOTER --- */}
      <footer className="relative z-10 border-t border-border/50 bg-[#FEFEFA]/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4">
            <Leaf size={16} />
          </div>
          <p className="text-muted-foreground font-sans text-sm">
            Crafted with zero-knowledge architecture.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;