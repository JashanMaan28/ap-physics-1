import { units } from "@/units/meta";

export function ExamWeightage() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="rounded-2xl border bg-card p-6 sm:p-8 backdrop-blur-sm">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground/80">Exam Weightage</h2>
            <p className="text-sm text-foreground/30">Multiple-choice section distribution by unit</p>
          </div>
          <span className="hidden text-[10px] text-foreground/20 font-mono sm:block">% of MC questions</span>
        </div>

        <div className="space-y-3">
          {units.map((unit) => {
            const match = unit.examWeight.match(/(\d+)[–-](\d+)/);
            const low = match ? parseInt(match[1]) : 5;
            const high = match ? parseInt(match[2]) : 10;
            const mid = (low + high) / 2;
            const barWidth = (mid / 23) * 85;

            return (
              <div key={unit.slug} className="group flex items-center gap-3">
                <div className="w-28 shrink-0 text-right sm:w-36">
                  <span className="text-xs font-medium text-foreground/50 group-hover:text-foreground/70 transition-colors">
                    {unit.shortName}
                  </span>
                </div>

                <div className="flex-1 h-6 rounded-lg bg-foreground/[0.03] overflow-hidden relative">
                  <div
                    className="h-full rounded-lg transition-all duration-700 flex items-center justify-end pr-2.5"
                    style={{
                      width: `${barWidth}%`,
                      background: `linear-gradient(90deg, color-mix(in oklch, ${unit.color} 40%, transparent), color-mix(in oklch, ${unit.color} 70%, transparent))`,
                    }}
                  >
                    <span className="text-[10px] font-mono font-semibold text-foreground/80">
                      {unit.examWeight}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-foreground/[0.04] flex flex-wrap gap-x-6 gap-y-2">
          <div className="flex items-center gap-2 text-[10px] text-foreground/25">
            <div className="h-2 w-2 rounded-full bg-amber-500/60" />
            <span>High weight (18–23%): Dynamics, Energy</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-foreground/25">
            <div className="h-2 w-2 rounded-full bg-blue-500/60" />
            <span>Medium (10–15%): Kinematics, Momentum, Torque, Fluids</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-foreground/25">
            <div className="h-2 w-2 rounded-full bg-teal-500/60" />
            <span>Lower (5–8%): Rotating Systems, Oscillations</span>
          </div>
        </div>
      </div>
    </section>
  );
}
