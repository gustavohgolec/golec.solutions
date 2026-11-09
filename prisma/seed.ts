import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Semeando dados iniciais do Golec Hub...");

  // 1. Usuário Diretor / Fundador Inicial
  const director = await prisma.user.upsert({
    where: { email: "diretoria@golec.solutions" },
    update: {},
    create: {
      name: "Gustavo H. Golec",
      email: "diretoria@golec.solutions",
      role: "OWNER",
      active: true,
    },
  });
  console.log(`✓ Usuário Diretor configurado: ${director.name}`);

  // 2. Unidades de Negócio Golec
  const units = [
    {
      code: "MARKETING",
      name: "Golec Marketing",
      description: "Planejamento, conteúdo editorial, redes sociais, tráfego e campanhas.",
      color: "#0066FF",
    },
    {
      code: "CREATIVE",
      name: "Golec Creative",
      description: "Identidade visual, branding, peças publicitárias e audiovisual.",
      color: "#8B5CF6",
    },
    {
      code: "DIGITAL",
      name: "Golec Digital",
      description: "Websites, landing pages de alta conversão, portais e SEO.",
      color: "#06B6D4",
    },
    {
      code: "SYSTEMS",
      name: "Golec Systems",
      description: "Hubs operacionais, automações com IA, integrações e software sob medida.",
      color: "#10B981",
    },
  ];

  for (const u of units) {
    await prisma.serviceUnit.upsert({
      where: { code: u.code },
      update: { name: u.name, description: u.description, color: u.color },
      create: u,
    });
  }
  console.log("✓ 4 Unidades de Serviço cadastradas");

  // 3. Etapas padrão do Pipeline Kanban do CRM
  const stages = [
    { name: "Novo lead", order: 1, color: "#64748B" },
    { name: "Contato realizado", order: 2, color: "#3B82F6" },
    { name: "Diagnóstico", order: 3, color: "#8B5CF6" },
    { name: "Proposta enviada", order: 4, color: "#F59E0B" },
    { name: "Negociação", order: 5, color: "#EC4899" },
    { name: "Ganho", order: 6, color: "#10B981" },
    { name: "Perdido", order: 7, color: "#EF4444" },
  ];

  for (const s of stages) {
    const existing = await prisma.pipelineStage.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.pipelineStage.create({ data: s });
    }
  }
  console.log("✓ Etapas do Funil de Vendas configuradas");

  // 4. Categorias Financeiras Iniciais
  const categories = [
    { name: "Honorários Recorrentes (Retainer)", type: "INCOME", costCenter: "Operação" },
    { name: "Projetos Pontuais / Setup", type: "INCOME", costCenter: "Projetos" },
    { name: "Consultoria e Sistemas", type: "INCOME", costCenter: "Systems" },
    { name: "Equipe e Parceiros Especialistas", type: "EXPENSE", costCenter: "Produção" },
    { name: "Softwares, Licenças e Ferramentas", type: "EXPENSE", costCenter: "TI & Infra" },
    { name: "Marketing e Prospecção Própria", type: "EXPENSE", costCenter: "Comercial" },
    { name: "Despesas Administrativas", type: "EXPENSE", costCenter: "Administrativo" },
  ];

  for (const c of categories) {
    const existing = await prisma.financialCategory.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.financialCategory.create({ data: c });
    }
  }
  console.log("✓ Categorias Financeiras cadastradas");

  // 5. Academia Golec: Trilhas de Implantação do Plano Mestre
  const tracks = [
    {
      order: 1,
      title: "1. Fundação e Posicionamento",
      description: "Proposta de valor, público-alvo, identidade e estruturação das 4 unidades.",
      badgeColor: "#0066FF",
      modules: [
        {
          order: 1,
          title: "Posicionamento Estratégico",
          summary: "Estratégia que conecta. Soluções que impulsionam.",
          pdfChapterRef: "Plano Mestre - Seção 1 (Pág. 2)",
          contentMd: "Definição do posicionamento híbrido: marketing, criatividade e tecnologia focados em vendas e operações para empresas em evolução.",
          items: [
            "Validar proposta de valor e slogan oficial",
            "Definir pacote de ofertas de entrada para cada unidade",
            "Configurar apresentação institucional de vendas",
          ],
        },
      ],
    },
    {
      order: 2,
      title: "2. Formalização e Administrativo",
      description: "CNPJ, CNAEs, regime tributário, contratos e conformidade LGPD.",
      badgeColor: "#8B5CF6",
      modules: [
        {
          order: 1,
          title: "Estrutura Societária e Fiscal",
          summary: "Revisão contábil e regularização jurídica.",
          pdfChapterRef: "Plano Mestre - Seção 9 (Pág. 5)",
          contentMd: "Revisar enquadramento do CNPJ atual com contador. Avaliar transição MEI para ME para comportar os CNAEs de tecnologia e publicidade.",
          items: [
            "Reunião de alinhamento com contador",
            "Mapeamento de CNAEs de marketing e desenvolvimento",
            "Definição de modelo padrão de Contrato de Prestação de Serviços",
          ],
        },
      ],
    },
    {
      order: 3,
      title: "3. Serviços e Precificação",
      description: "Catálogo oficial, precificação com margem real e limites de revisão.",
      badgeColor: "#10B981",
      modules: [
        {
          order: 1,
          title: "Catálogo e Tabela de Referência",
          summary: "Montagem da esteira de produtos e serviços.",
          pdfChapterRef: "Plano Mestre - Seções 4 e 5 (Págs. 3-4)",
          contentMd: "Estabelecer modelos de cobrança: mensal (retainer), setup único e sob demanda, discriminando verbas de mídia e hospedagem de terceiros.",
          items: [
            "Estruturar pacotes de Retainer de Marketing",
            "Definir escopo padrão de Landing Pages e Sistemas",
            "Criar modelo visual de Proposta Comercial rápida",
          ],
        },
      ],
    },
    {
      order: 4,
      title: "4. Operação e Entregas (90 Dias)",
      description: "Fluxo comercial de 7 etapas, onboarding e gestão de prazos.",
      badgeColor: "#F59E0B",
      modules: [
        {
          order: 1,
          title: "Fluxo Operacional Padrão",
          summary: "Prospecção → Diagnóstico → Proposta → Fechamento → Onboarding → Produção → Aprovação",
          pdfChapterRef: "Plano Mestre - Seção 6 (Pág. 4)",
          contentMd: "Padronizar o checklist de boas-vindas do cliente para recolher acessos sem armazenar senhas em texto puro e iniciar produção com briefing alinhado.",
          items: [
            "Configurar checklist de Onboarding de novos clientes",
            "Testar fluxo de conversão de Oportunidade no CRM",
            "Alinhar rede de parceiros freelancers por especialidade",
          ],
        },
      ],
    },
  ];

  for (const t of tracks) {
    let track = await prisma.knowledgeTrack.findFirst({ where: { title: t.title } });
    if (!track) {
      track = await prisma.knowledgeTrack.create({
        data: {
          order: t.order,
          title: t.title,
          description: t.description,
          badgeColor: t.badgeColor,
        },
      });
    }

    for (const m of t.modules) {
      let module = await prisma.knowledgeModule.findFirst({ where: { title: m.title, trackId: track.id } });
      if (!module) {
        module = await prisma.knowledgeModule.create({
          data: {
            trackId: track.id,
            order: m.order,
            title: m.title,
            summary: m.summary,
            contentMd: m.contentMd,
            pdfChapterRef: m.pdfChapterRef,
          },
        });
      }

      for (let i = 0; i < m.items.length; i++) {
        const itemTitle = m.items[i];
        let item = await prisma.knowledgeItem.findFirst({ where: { title: itemTitle, moduleId: module.id } });
        if (!item) {
          item = await prisma.knowledgeItem.create({
            data: {
              moduleId: module.id,
              order: i + 1,
              title: itemTitle,
              isChecklist: true,
            },
          });
          // Progresso inicial
          await prisma.knowledgeProgress.create({
            data: {
              itemId: item.id,
              status: "NOT_STARTED",
            },
          });
        }
      }
    }
  }
  console.log("✓ Trilhas e Checklists da Academia Golec semeados com sucesso!");

  console.log("🚀 Semeação concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

