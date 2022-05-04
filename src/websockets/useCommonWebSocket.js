import { Token } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useWebSocket } from "../Atom";

const BASE_URL = "wss://todobackend.honeycombpizza.link/ws";
export function useCommonWebSocket(user_id, projects, setProjects) {
  const ws = useWebSocket(`${BASE_URL}/common/`);
  if (ws) {
    ws.onopen = (e) => {};
    ws.onmessage = (e) => {
      const message = jp(e);
      const action = message.action;
      const result = message.data ? message.data[0] : null;
      if (action == "rename_project") {
        setProjects(
          projects.map((res) => {
            if (res.project_id != result.project_id) {
              return res;
            } else {
              return result;
            }
          })
        );
      } else if (action == "delete_project") {
        setProjects(
          projects.filter((res) => res.project_id != result.project_id)
        );
      } else if (action == "add_user") {
        setProjects(
          projects.map((res) => {
            if (res.project_id != result.project_id) {
              return res;
            } else {
              return result;
            }
          })
        );
      } else if (action == "del_user") {
        if (
          result.participant.filter((res) => res.id === user_id).length == 0
        ) {
          //나가기 누른 쪽에서는 프로젝트 삭제
          setProjects(
            projects.filter((res) => res.project_id !== result.project_id)
          );
        } else {
          //프로젝트에 참여중인 사람들은 프로젝트 갱신
          setProjects(
            projects.map((res) => {
              if (res.project_id === result.project_id) {
                return result;
              }
              return res;
            })
          );
        }
      } else if (action == "ban_user") {
        if (
          result.participant.filter((res) => res.id === user_id).length == 0
        ) {
          //나가기 누른 쪽에서는 프로젝트 삭제
          setProjects(
            projects.filter((res) => res.project_id !== result.project_id)
          );
        } else {
          //프로젝트에 참여중인 사람들은 프로젝트 갱신
          setProjects(
            projects.map((res) => {
              if (res.project_id === result.project_id) {
                return result;
              }
              return res;
            })
          );
        }
      } else if (action == "change_rule") {
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
      } else if (action == "create_tag") {
        setProjects(
          projects.map((res) => {
            if (res.project_id == result.project_id) {
              return {
                ...res,
                tags: result.tags,
              };
            }
            return res;
          })
        );
      } else if (action == "modify_tag") {
        setProjects(
          projects.map((res) => {
            if (res.project_id == result.project_id) {
              return {
                ...res,
                tags: result.tags,
              };
            }
            return res;
          })
        );
      } else if (action == "delete_tag") {
        setProjects(
          projects.map((res) => {
            if (res.project_id == result.project_id) {
              return {
                ...res,
                tags: result.tags,
              };
            }
            return res;
          })
        );
      }
      ws.onclose = (e) => {
        // console.log("CommonWS closed");
      };
    };
  }
}

function jp(e) {
  return JSON.parse(e.data);
}
