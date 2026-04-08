import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default function MealsPage() {
  return (
    <PageContainer>
      <Header title="Meal Planner" subtitle="Plan your weekly meals" />
      <GlassCard>
        <p className="text-dark-300">Assign recipes to each meal slot throughout the week.</p>
      </GlassCard>
    </PageContainer>
  );
}
