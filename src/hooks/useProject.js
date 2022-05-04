import { useEffect, useState } from "react";
import { useToken } from ".";
import { TODO } from "../API/todo";
import { useCurrentProject, useGetAllProjects } from "../Atom";
import { useCommonWebSocket } from "../websockets/useCommonWebSocket";

export function getProjects(user_id) {
  const [projects, setProjects] = useGetAllProjects();
  const [curPro, setCurPro] = useCurrentProject();
  const [token, setToken] = useToken();
  useCommonWebSocket(user_id, projects, setProjects);
  useEffect(async () => {
    if (user_id) {
      const result = await TODO.get_all_projects_by_id(user_id);
      if (result) {
        const _result = result.filter((res) => res.project_id != null);
        setProjects(_result);
      } else {
        setProjects([]);
      }
    }
  }, [user_id]);
  const addHandler = async (name, token) => {
    const result = await TODO.make_project(name, token);
    setCurPro(result);
    setProjects([...projects, result]);
  };
  const removeHandler = async (token, targetProject) => {
    const check = projects.filter((res) => {
      return res.project_id == targetProject.project_id;
    });
    if (check.length >= 1) {
      const result = await TODO.delete_project(token, targetProject);
      console.log(result);
      if (result) {
      } else {
        alert("err!");
      }
    }
  };
  const renameHandler = async (token, targetProject, name) => {
    const result = await TODO.rename_project(token, targetProject, name);
    if (result) {
    } else {
      alert("err!");
    }
  };
  const appendHandler = async (targetProject) => {
    setProjects([...projects, targetProject]);
  };
  const changeRuleHandler = async (project_id, author_id, message) => {
    const result = await TODO.changeRule(token, project_id, author_id, message);
    if (result) {
    } else {
      alert("err!");
    }
  };
  const joinHandler = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const code = form.get("code");
    const result = await TODO.joinProject(token, code);
    if (result) {
      appendHandler(result);
    } else {
      alert("err!");
    }
  };
  const leaveHandler = async (project) => {
    const result = await TODO.leave_project(token, project);
    if (result) {
    } else {
      alert("err!");
    }
  };
  const banHandler = async (project, target) => {
    const result = await TODO.ban_user_from_project(token, project, target);
    if (result) {
    } else {
      alert("err!");
    }
  };
  const createTagHandler = async (project, code, name) => {
    const result = await TODO.create_tag(token, project, code, name);
    if (result) {
    } else {
      alert("err!");
    }
  };
  const modifyTagHandler = async (tag_id, code, name) => {
    const result = await TODO.modify_tag(token, tag_id, code, name);
    if (result) {
    } else {
      alert("err!");
    }
  };
  const deleteTagHandler = async (project_id, tag_id) => {
    const result = await TODO.delete_tag(token, project_id, tag_id);
    if (result) {
    } else {
      alert("err!");
    }
  };
  return [
    projects,
    addHandler,
    removeHandler,
    appendHandler,
    renameHandler,
    changeRuleHandler,
    joinHandler,
    leaveHandler,
    banHandler,
    createTagHandler,
    modifyTagHandler,
    deleteTagHandler,
  ];
}
