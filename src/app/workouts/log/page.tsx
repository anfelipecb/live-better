import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default function LogWorkoutPage() {
  return (
    <PageContainer>
      <Header title="Log Workout" subtitle="Record your training session" />
      <GlassCard>
        <p className="text-dark-300">Log your exercises, sets, reps, and weights.</p>
      </GlassCard>
    </PageContainer>
  );
}
