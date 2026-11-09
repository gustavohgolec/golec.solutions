import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { prisma } from "@/lib/prisma";
import { ProjectManager } from "./ProjectManager";

export default async function ProjetosPage() {
  const [projects, clients, services] = await Promise.all([
    prisma.project.findMany({
      include: {
        client: { include: { company: true } },
        service: true,
        tasks: { orderBy: { createdAt: "asc" } },
        deliverables: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.client.findMany({
      include: { company: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.service.findMany({
      include: { unit: true },
      where: { active: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="flex w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-[#090D16]">
        <Header
          title="Projetos & Tarefas"
          subtitle="Acompanhamento de entregas, cronogramas, prazos e aprovações"
        />

        <main className="p-8 space-y-8 flex-1 max-w-7xl">
          <ProjectManager
            initialProjects={projects}
            clients={clients}
            services={services}
          />
        </main>
      </div>
    </div>
  );
}
