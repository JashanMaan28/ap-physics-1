function StatCard({ value, label, sublabel }: { value: string; label: string; sublabel: string }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 backdrop-blur-sm transition-[box-shadow] hover:shadow-md">
      <div className="text-3xl font-bold font-mono text-foreground/90 tracking-tight">{value}</div>
      <div className="mt-1 text-sm font-medium text-foreground/60">{label}</div>
      <div className="mt-0.5 text-xs text-foreground/30">{sublabel}</div>
    </div>
  );
}

const EXAM_FEATURES = [
  { icon: "📐", title: "Algebra-Based", desc: "No calculus required. Uses algebra, geometry, and trigonometry." },
  { icon: "📊", title: "Equation Sheet", desc: "A reference table of equations and constants is provided during the exam." },
  { icon: "🧪", title: "Lab Skills", desc: "Experimental design and data analysis questions appear on the exam." },
];

export function ExamInfo() {
  return (
    <section className="relative border-t border-foreground/[0.04]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,oklch(0.2_0.06_260_/_0.2),transparent)]" />
      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-xl font-semibold text-foreground/80">About the Exam</h2>
          <p className="mt-1 text-sm text-foreground/30">AP Physics 1: Algebra-Based</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard value="40" label="Multiple Choice" sublabel="90 minutes · 50% of score" />
          <StatCard value="5" label="Free Response" sublabel="90 minutes · 50% of score" />
          <StatCard value="3h" label="Total Duration" sublabel="Calculator allowed throughout" />
          <StatCard value="5" label="Score Scale" sublabel="3+ qualifies for credit" />
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {EXAM_FEATURES.map((item) => (
            <div key={item.title} className="flex gap-3 rounded-xl border bg-card p-4">
              <span className="text-lg">{item.icon}</span>
              <div>
                <h4 className="text-sm font-medium text-foreground/70">{item.title}</h4>
                <p className="mt-0.5 text-xs text-foreground/30 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
