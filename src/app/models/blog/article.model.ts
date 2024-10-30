import { Profile } from "../auth/profile.model";
import { Tag } from "./tag.model";

export interface Article {
  id: string;
  title: string;
  description: string;
  body: string;
  tagList: Tag[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
}
