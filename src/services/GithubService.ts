import axios from "axios";
import { Repository } from "../interfaces/Repository";
import { GithubUser } from "../interfaces/GithubUser";
import { RepositoryPayload } from "../interfaces/RepositoryPayload";

const GITHUB_API_URL =
  import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";

const GITHUB_API_TOKEN = import.meta.env.VITE_GITHUB_API_TOKEN;

const githubClient = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    Authorization: `Bearer ${GITHUB_API_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
  },
});

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado.";
};

export const fetchRepositories = async (): Promise<Repository[]> => {
  try {
    const response = await githubClient.get("/user/repos", {
      params: {
        per_page: 100,
        sort: "created",
        direction: "desc",
        affiliation: "owner",
        t: Date.now(),
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al leer repositorios", error);
    throw new Error(getErrorMessage(error));
  }
};

export const createRepository = async (
  repository: RepositoryPayload
): Promise<Repository> => {
  try {
    const response = await githubClient.post("/user/repos", repository);
    return response.data as Repository;
  } catch (error) {
    console.error("Error al crear repositorios", error);
    throw new Error(getErrorMessage(error));
  }
};

export const deleteRepository = async (owner: string, repo: string): Promise<void> => {
  try {
    await githubClient.delete(`/repos/${owner}/${repo}`);
  } catch (error) {
    console.error("Error al eliminar repositorio", error);
    throw new Error(getErrorMessage(error));
  }
};

export const updateRepository = async (
  owner: string,
  repo: string,
  updates: Partial<RepositoryPayload>
): Promise<Repository> => {
  try {
    const response = await githubClient.patch(`/repos/${owner}/${repo}`, updates);
    return response.data as Repository;
  } catch (error) {
    console.error("Error al actualizar repositorio", error);
    throw new Error(getErrorMessage(error));
  }
};

export const fetchUserInfo = async (): Promise<GithubUser | null> => {
  try {
    const response = await githubClient.get("/user");

    return response.data as GithubUser;
  } catch (error) {
    console.error("Error al leer usuario", error);
    throw new Error(getErrorMessage(error));
  }
};