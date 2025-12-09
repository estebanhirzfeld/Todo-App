export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
}

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    userId: string;
}

export const users: User[] = [];
export const tasks: Task[] = [];
