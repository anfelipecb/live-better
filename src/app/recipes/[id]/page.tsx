import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <PageContainer>
      <Header title="Recipe" subtitle={`Recipe ${id}`} />
      <GlassCard>
        <p className="text-dark-300">Full recipe with ingredients, steps, and nutrition info.</p>
      </GlassCard>
    </PageContainer>
  );
}
