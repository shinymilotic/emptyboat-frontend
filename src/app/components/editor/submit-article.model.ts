import { Profile } from "src/app/models/auth/profile.model";

export interface SubmitArticle {
    title: string;
    description: string;
    body: string;
    tagList: string[];
    createdAt: string;
    updatedAt: string;
    author: Profile;
  }
  