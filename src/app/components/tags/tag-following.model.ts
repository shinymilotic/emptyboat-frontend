import { Tag } from "src/app/models/blog/tag.model";

export interface TagFollowing extends Tag {
    following: boolean;
}