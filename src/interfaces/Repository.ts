export interface Repository {
    id: number;
    name: string;
    description: string | null;
    language: string | null;
    owner: {
        login: string;
        avatar_url: string;
    }
}