import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default function GoalsPage() {
  return (
    <PageContainer>
      <Header title="Goals & Habits" subtitle="Build consistency" />
      <GlassCard>
        <p className="text-dark-300">Track daily habits and long-term goals with milestones.</p>
      </GlassCard>
    </PageContainer>
  );
}
