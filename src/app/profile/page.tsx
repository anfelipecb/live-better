import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default function ProfilePage() {
  return (
    <PageContainer>
      <Header title="Profile" subtitle="Your stats and progress" />
      <GlassCard>
        <p className="text-dark-300">Track body weight, body fat percentage, and measurements over time.</p>
      </GlassCard>
    </PageContainer>
  );
}
