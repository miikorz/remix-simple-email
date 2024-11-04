import { useEffect, useState } from "react";
import apiClient from "~/apiClient/apiClient";
import { Tag } from "~/interfaces/Tag";

export const useTag = () => {  
  const [ tags, setTags ] = useState<Tag[]>([]);
  const [ newTag, setNewTag ] = useState<string>("");
  const [ error, setError ] = useState<string>("");

  useEffect(() => {
    fetchTags();
  }, []);
  
  const fetchTags = async () => {
    const tags = await apiClient.fetchTags();

    setTags(tags);
  }

  const createNewTag = async () => {
    setError("");

    if (!newTag) return;

    if (tags.some((tag) => tag.name.toLowerCase() === newTag.toLowerCase())) {
      setError("Tag already exists");
      return;
    }

    const createdTag = await apiClient.createNewTag("create", newTag);
    
    setTags((prevTags) => [...prevTags, createdTag]);
    setNewTag("");
  } 

  const deleteTag = async (tag: Tag) => {
    setError("");
    const tagsResponse = await apiClient.deleteTag("delete", tag.id.toString());
    
    if (tagsResponse.error) {
      setError(tagsResponse.error);
    } else {
      setTags(tagsResponse);
    }
    
  }
  
  const getTag = (id: number): string => {
    const tag: Tag = tags.find((tag) => tag.id === id) || {id: 0, name: "unexpected tag"};

    return tag.name;
  }

  return { tags, getTag, createNewTag, deleteTag, error, setNewTag, newTag };
};
