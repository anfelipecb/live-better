import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default async function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageContainer>
      <Header title="Workout Detail" subtitle={`Workout ${id}`} />
      <GlassCard>
        <p className="text-dark-300">Detailed view of your workout session.</p>
      </GlassCard>
    </PageContainer>
  );
}
