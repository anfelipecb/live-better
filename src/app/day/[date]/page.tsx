import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default async function DayPlannerPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  return (
    <PageContainer>
      <Header title="Day Planner" subtitle={date} />
      <GlassCard>
        <p className="text-dark-300">Plan your day with morning, afternoon, and evening blocks.</p>
      </GlassCard>
    </PageContainer>
  );
}
