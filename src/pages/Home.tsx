import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Chrome, Sparkles, Search, Folder, Cloud, Settings, MessageCircle, Palette, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Slash Command Prompt Access (/)",
      description: "Type / to instantly open your saved prompts inside ChatGPT, Claude, or Midjourney — and insert with a click."
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Prompt Search + Tags",
      description: "Use keywords or tags to filter and insert the right prompt in seconds."
    },
    {
      icon: <Folder className="w-6 h-6" />,
      title: "Folders & Collections",
      description: "Group prompts by project, use case, or client."
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: "Cloud-Synced Access Anywhere",
      description: "Your prompts live securely in the cloud — not tied to a single device."
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Custom Variables",
      description: "Use dynamic fields inside prompts (e.g., {{topic}}) that auto-clear before use."
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Comment Mode (Non-Sent Notes)",
      description: "Add private notes to prompts that are not passed to AI tools."
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Dark Mode + Clean UI",
      description: "A beautiful, distraction-free interface made for creators and AI power users."
    }
  ];

  const supportedTools = [
    "ChatGPT",
    "Claude", 
    "Midjourney (via Discord)",
    "Google Gemini",
    "Bing AI",
    "Your favorite AI tools in the browser"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-card border-b border-border/50 shadow-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-text bg-clip-text text-transparent">
                  PromptPal
                </h1>
                <p className="text-xs text-muted-foreground">Chrome Extension</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to="/prompts">Open App</Link>
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90" size="sm">
                <Chrome className="w-4 h-4 mr-2" />
                Add to Chrome
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-4xl">🧠</span>
            <h1 className="text-5xl font-bold bg-gradient-text bg-clip-text text-transparent">
              PromptPal
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Your Ultimate AI Prompt Manager
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Save, reuse, and organize your best prompts for ChatGPT, Midjourney, Claude, and other AI tools — all in one clean, powerful Chrome extension.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90">
              <Chrome className="w-5 h-5 mr-2" />
              Add to Chrome - Free
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/prompts">Try Web Version</Link>
            </Button>
          </div>

          <Badge variant="secondary" className="text-sm px-4 py-2">
            🚀 No signup required • Works instantly
          </Badge>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Tired of digging through Notion docs, Google Sheets, or scattered notes to find your best prompts?
          </h3>
          <p className="text-lg text-muted-foreground">
            PromptPal helps you manage all your prompts with one-click access, slash commands, tags, and folders — so you can focus on creation, not copy-paste chaos.
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">🔑 Key Features</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Tools */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-foreground mb-8">
            ⚙️ Works Seamlessly With:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {supportedTools.map((tool, index) => (
              <div key={index} className="flex items-center gap-2 text-foreground">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why PromptPal */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-8">🚀 Why PromptPal?</h3>
          <div className="space-y-6 text-lg">
            <p className="text-muted-foreground">
              Most prompt managers are either too simple or too cluttered.
            </p>
            <p className="text-foreground font-medium">
              PromptPal is designed for real users — creators, devs, marketers, and AI explorers — who need speed, organization, and control.
            </p>
            <p className="text-muted-foreground">
              No more switching tabs or copy-pasting from files — just press <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">/</kbd>, search, and go.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-card">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-foreground mb-6">
            Ready to supercharge your AI workflow?
          </h3>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who've streamlined their prompt management with PromptPal.
          </p>
          <Button size="lg" className="bg-gradient-primary hover:opacity-90">
            <Chrome className="w-5 h-5 mr-2" />
            Install PromptPal Extension
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 PromptPal. Built for AI creators, by AI creators.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;