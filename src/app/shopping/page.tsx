import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import GlassCard from "@/components/ui/GlassCard";

export default function ShoppingPage() {
  return (
    <PageContainer>
      <Header title="Shopping List" subtitle="Everything you need" />
      <GlassCard>
        <p className="text-dark-300">Auto-generated from your meal plan, plus manual items.</p>
      </GlassCard>
    </PageContainer>
  );
}
