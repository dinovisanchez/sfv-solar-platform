import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { AssistantChat } from "@/components/assistant/AssistantChat";

export function AssistantPage() {
  return (
    <DashboardPage title="Asistente IA solar">
      <div className="mx-auto max-w-2xl">
        <AssistantChat variant="full" />
      </div>
    </DashboardPage>
  );
}
