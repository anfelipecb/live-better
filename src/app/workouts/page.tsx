import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default function WorkoutsPage() {
  return (
    <PageContainer>
      <Header title="Workouts" subtitle="Track your training" />
      <GlassCard>
        <p className="text-dark-300">Your workout log and weekly training schedule.</p>
      </GlassCard>
    </PageContainer>
  );
}
