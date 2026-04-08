import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default function RecipesPage() {
  return (
    <PageContainer>
      <Header title="Recipes" subtitle="Browse healthy recipes" />
      <GlassCard>
        <p className="text-dark-300">Discover recipes curated for your nutrition goals.</p>
      </GlassCard>
    </PageContainer>
  );
}
