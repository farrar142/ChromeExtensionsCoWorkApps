import { useEffect, useState } from "react";
import { useToken } from ".";
import { TODO } from "../API/todo";
import { useCurrentProject, useGetAllProjects } from "../Atom";

export function getProjects(user_id) {
  const [projects, setProjects] = useGetAllProjects();
  const [curPro, setCurPro] = useCurrentProject();
  const [token, setToken] = useToken();
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
      if (result) {
        setProjects(
          projects.filter((res) => res.project_id != targetProject.project_id)
        );
      }
    }
  };
  const renameHandler = async (token, targetProject, name) => {
    const result = await TODO.rename_project(token, targetProject, name);
    if (result) {
      setProjects(
        projects.map((res) => {
          if (res.project_id != result.project_id) {
            return res;
          } else {
            return result;
          }
        })
      );
    }
  };
  const appendHandler = async (targetProject) => {
    setProjects([...projects, targetProject]);
  };
  const changeRuleHandler = async (project_id, author_id, message) => {
    const result = await TODO.changeRule(token, project_id, author_id, message);
    if (result) {
      setProjects(
        projects.map((res) => {
          if (res.project_id == result.project_id) {
            return {
              ...res,
              participant: res.participant.map((_res) => {
                if (_res.id == result.author_id) {
                  return {
                    ..._res,
                    level: result.rule,
                  };
                }
                return _res;
              }),
            };
          }
          return res;
        })
      );
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
  ];
}
