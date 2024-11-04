export interface Email {
    id: number;
    subject: string;
    body: string;
    read: boolean;
    tags: { tagId: number, emailId: number }[];
}