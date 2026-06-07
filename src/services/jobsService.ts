import { Job, MOCK_JOBS } from "../mocks/jobs";

// Futuramente: substituir por chamadas Axios
// import api from "./api";

export type FilterType = "Todos" | "Remoto" | "Tempo Integral";

export async function getJobs(filter: FilterType = "Todos"): Promise<Job[]> {
  await new Promise((r) => setTimeout(r, 300)); // simula latência
  if (filter === "Todos") return MOCK_JOBS;
  if (filter === "Remoto") return MOCK_JOBS.filter((j) => j.type === "Remoto");
  if (filter === "Tempo Integral") return MOCK_JOBS.filter((j) => j.regime === "Tempo Integral");
  return MOCK_JOBS;
}

export async function getJobById(id: string): Promise<Job | undefined> {
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_JOBS.find((j) => j.id === id);
}

export async function searchJobs(query: string): Promise<Job[]> {
  await new Promise((r) => setTimeout(r, 300));
  const q = query.toLowerCase();
  return MOCK_JOBS.filter(
    (j) =>
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
  );
}

export async function toggleSaveJob(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 100));
  const job = MOCK_JOBS.find((j) => j.id === id);
  if (job) job.isSaved = !job.isSaved;
  return job?.isSaved ?? false;
}
