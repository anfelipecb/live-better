import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default function WeekPage() {
  return (
    <PageContainer>
      <Header title="Week Overview" subtitle="See your full week at a glance" />
      <GlassCard>
        <p className="text-dark-300">Your weekly overview with workouts, meals, and tasks.</p>
      </GlassCard>
    </PageContainer>
  );
}
