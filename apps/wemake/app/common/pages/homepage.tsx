import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";

export default function Homepage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)] opacity-0 dark:opacity-20 transition-opacity duration-1000" />
          <div className="container px-4 mx-auto md:px-6 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 text-sm font-medium rounded-full bg-muted text-muted-foreground">
              <span className="relative flex w-2 h-2 mr-2">
                <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-primary"></span>
                <span className="relative inline-flex w-2 h-2 rounded-full bg-primary"></span>
              </span>
              v1.0 is now live
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build your ideas, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-purple-600">
                faster than ever.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              The ultimate platform for creators and developers. Turn your concepts into reality
              with our powerful suite of tools designed for modern web development.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="h-12 px-8 text-base">
                Start Building
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                View Documentation
              </Button>
            </div>

            {/* Visual Abstract/Hero Image Placeholder */}
            <div className="mt-20 relative mx-auto max-w-5xl">
              <div className="aspect-video rounded-xl border bg-card shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-purple-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 text-9xl font-black select-none pointer-events-none">
                  UI
                </div>
              </div>
              <div className="absolute -inset-4 -z-10 bg-linear-to-r from-primary to-purple-600 rounded-xl blur-2xl opacity-20" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/30">
          <div className="container px-4 mx-auto md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Everything you need
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Focus on your product, we handle the infrastructure.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 mt-16 md:grid-cols-3">
              {[
                {
                  title: "Rapid Development",
                  description: "Built for speed with instant hot reloading and optimized builds.",
                  icon: "⚡",
                },
                {
                  title: "Secure by Default",
                  description: "Enterprise-grade security features built-in from day one.",
                  icon: "🔒",
                },
                {
                  title: "Global Scale",
                  description: "Deploy to the edge in seconds and reach users worldwide.",
                  icon: "🌍",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col p-8 space-y-4 transition-all border rounded-xl bg-card hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 md:py-16 bg-muted/10">
        <div className="container px-4 mx-auto md:px-6">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
                <span className="text-primary">we</span>make
              </Link>
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                Empowering the next generation of web builders.
              </p>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Company</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link to="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">© 2026 WeMake Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
