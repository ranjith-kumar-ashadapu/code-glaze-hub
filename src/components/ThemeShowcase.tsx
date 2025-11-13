/**
 * ThemeShowcase.tsx
 * 
 * Visual reference for all the new theme colors, gradients, and utilities
 * added to the design system. Use this to verify light/dark themes work correctly.
 * 
 * Available classes:
 * - Colors: bg-light-bg, text-light-text-primary, bg-dark-bg, etc.
 * - Gradients: bg-accent-light, bg-accent-dark, bg-heading-gradient, bg-btn-gradient-light
 * - Components: .ui-card, .btn-gradient, .gradient-heading, .badge-{easy,medium,hard}
 * - Typography: .heading-font, .body-font, .mono-font
 */

export function ThemeShowcase() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="gradient-heading heading-font text-5xl">
            Theme Showcase
          </h1>
          <p className="body-font text-light-text-secondary dark:text-dark-text-secondary text-lg">
            Visual reference for the new design system: colors, gradients, and components.
          </p>
        </div>

        {/* Light Theme Section */}
        <div className="space-y-6">
          <h2 className="heading-font text-3xl text-light-text-primary dark:text-dark-text-primary">
            Light Theme Palette
          </h2>
          
          {/* Color Swatches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Background */}
            <div className="ui-card space-y-2">
              <div className="w-full h-24 rounded-lg bg-light-bg"></div>
              <p className="heading-font text-sm">Background</p>
              <p className="mono-font text-xs text-light-text-secondary">#F8F6FF</p>
            </div>

            {/* Card BG */}
            <div className="ui-card space-y-2">
              <div className="w-full h-24 rounded-lg bg-light-card"></div>
              <p className="heading-font text-sm">Card BG</p>
              <p className="mono-font text-xs text-light-text-secondary">#F0E9FF</p>
            </div>

            {/* Primary Text */}
            <div className="ui-card space-y-2">
              <div className="w-full h-24 rounded-lg bg-light-text-primary flex items-center justify-center">
                <span className="text-white heading-font">Aa</span>
              </div>
              <p className="heading-font text-sm">Primary Text</p>
              <p className="mono-font text-xs text-light-text-secondary">#1A1A1A</p>
            </div>

            {/* Secondary Text */}
            <div className="ui-card space-y-2">
              <div className="w-full h-24 rounded-lg bg-light-text-secondary flex items-center justify-center">
                <span className="text-white heading-font">Aa</span>
              </div>
              <p className="heading-font text-sm">Secondary Text</p>
              <p className="mono-font text-xs text-light-text-secondary">#555555</p>
            </div>
          </div>

          {/* Badge Colors */}
          <div className="space-y-3">
            <p className="heading-font text-lg">Badge Colors</p>
            <div className="flex flex-wrap gap-3">
              <span className="badge badge-easy">Easy</span>
              <span className="badge badge-medium">Medium</span>
              <span className="badge badge-hard">Hard</span>
            </div>
          </div>

          {/* Gradients */}
          <div className="space-y-3">
            <p className="heading-font text-lg">Accent Gradient</p>
            <div className="ui-card h-20 bg-accent-light"></div>
            <p className="mono-font text-sm text-light-text-secondary">
              linear-gradient(90deg, #A66CFF, #C77DFF, #9D4EDD)
            </p>
          </div>

          <div className="space-y-3">
            <p className="heading-font text-lg">Heading Gradient</p>
            <h3 className="gradient-heading heading-font text-3xl">
              Browse by Category
            </h3>
            <p className="mono-font text-sm text-light-text-secondary">
              linear-gradient(90deg, #7B2FF7, #F107A3)
            </p>
          </div>
        </div>

        {/* Dark Theme Section */}
        <div className="space-y-6 dark">
          <h2 className="heading-font text-3xl text-dark-text-primary">
            Dark Theme Palette
          </h2>

          {/* Color Swatches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Background */}
            <div className="ui-card space-y-2">
              <div className="w-full h-24 rounded-lg bg-dark-bg"></div>
              <p className="heading-font text-sm">Background</p>
              <p className="mono-font text-xs text-dark-text-secondary">#0F051E</p>
            </div>

            {/* Card BG */}
            <div className="ui-card space-y-2">
              <div className="w-full h-24 rounded-lg bg-dark-card"></div>
              <p className="heading-font text-sm">Card BG</p>
              <p className="mono-font text-xs text-dark-text-secondary">#1C1230</p>
            </div>

            {/* Primary Text */}
            <div className="ui-card space-y-2">
              <div className="w-full h-24 rounded-lg bg-dark-text-primary flex items-center justify-center">
                <span className="text-dark-bg heading-font">Aa</span>
              </div>
              <p className="heading-font text-sm">Primary Text</p>
              <p className="mono-font text-xs text-dark-text-secondary">#EDE9FE</p>
            </div>

            {/* Secondary Text */}
            <div className="ui-card space-y-2">
              <div className="w-full h-24 rounded-lg bg-dark-text-secondary flex items-center justify-center">
                <span className="text-dark-bg heading-font">Aa</span>
              </div>
              <p className="heading-font text-sm">Secondary Text</p>
              <p className="mono-font text-xs text-dark-text-secondary">#C4B5FD</p>
            </div>
          </div>

          {/* Badge Colors Dark */}
          <div className="space-y-3">
            <p className="heading-font text-lg">Badge Colors (Dark)</p>
            <div className="flex flex-wrap gap-3">
              <span className="badge badge-easy">Easy</span>
              <span className="badge badge-medium">Medium</span>
              <span className="badge badge-hard">Hard</span>
            </div>
          </div>

          {/* Gradients Dark */}
          <div className="space-y-3">
            <p className="heading-font text-lg">Accent Gradient (Dark)</p>
            <div className="ui-card h-20 bg-accent-dark"></div>
            <p className="mono-font text-sm text-dark-text-secondary">
              linear-gradient(90deg, #C77DFF, #9D4EDD, #7B2FF7)
            </p>
          </div>
        </div>

        {/* Components Demo */}
        <div className="space-y-6">
          <h2 className="heading-font text-3xl text-light-text-primary dark:text-dark-text-primary">
            Components
          </h2>

          {/* Card */}
          <div className="ui-card">
            <h3 className="heading-font text-xl mb-2">Card Component</h3>
            <p className="body-font text-light-text-secondary dark:text-dark-text-secondary">
              Glassy blur effect with gradient border and soft shadow. Hover for enhanced glow.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <p className="heading-font text-lg">Buttons</p>
            <div className="flex flex-wrap gap-3">
              <button className="btn-gradient">Get Started</button>
              <button className="btn-gradient opacity-80 hover:opacity-100">Secondary</button>
            </div>
          </div>

          {/* Typography */}
          <div className="space-y-3">
            <p className="heading-font text-lg">Typography</p>
            <div className="space-y-2">
              <p className="heading-font text-2xl">Heading Font (Poppins)</p>
              <p className="body-font text-base">Body Font (Inter) – This is regular body text used throughout the app.</p>
              <p className="mono-font text-sm">Mono Font (JetBrains Mono) – code snippets and technical content</p>
            </div>
          </div>
        </div>

        {/* Usage Guide */}
        <div className="ui-card space-y-4">
          <h2 className="heading-font text-2xl">Usage Guide</h2>
          <div className="space-y-3 text-sm body-font">
            <p>
              <strong>Gradient Heading:</strong>
              <code className="mono-font block bg-light-card dark:bg-dark-card p-2 rounded mt-1">
                &lt;h1 className="gradient-heading heading-font"&gt;...&lt;/h1&gt;
              </code>
            </p>
            <p>
              <strong>Button with Gradient:</strong>
              <code className="mono-font block bg-light-card dark:bg-dark-card p-2 rounded mt-1">
                &lt;button className="btn-gradient"&gt;...&lt;/button&gt;
              </code>
            </p>
            <p>
              <strong>Card Component:</strong>
              <code className="mono-font block bg-light-card dark:bg-dark-card p-2 rounded mt-1">
                &lt;div className="ui-card"&gt;...&lt;/div&gt;
              </code>
            </p>
            <p>
              <strong>Badge:</strong>
              <code className="mono-font block bg-light-card dark:bg-dark-card p-2 rounded mt-1">
                &lt;span className="badge badge-easy"&gt;Easy&lt;/span&gt;
              </code>
            </p>
            <p>
              <strong>Direct Colors:</strong>
              <code className="mono-font block bg-light-card dark:bg-dark-card p-2 rounded mt-1">
                &lt;div className="bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary"&gt;
              </code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
