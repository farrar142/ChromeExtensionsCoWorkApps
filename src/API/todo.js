import React, { Component, useEffect, useState } from "react";
import axios from "axios";
import {} from "../Atom";
import { useRecoilState, useRecoilValue } from "recoil";
const base_url = "https://todobackend.honeycombpizza.link";
async function post(api, data = {}) {
  return await axios.post(base_url + api, data);
}
async function get(api, data = {}) {
  return axios.get(base_url + api, data);
}
async function del(api, data = {}) {
  return axios.delete(base_url + api, { data });
}

async function put(api, data = {}) {
  return axios.put(base_url + api, data);
}
// auth().Signin().result
class Auth {
  access_token;
  login = async (email, pw) => {
    const signinUrl = "/api/signin/";
    return await post(signinUrl, {
      email: email,
      password: pw,
    })
      .then((res) => {
        const result = res.data[0];
        this.set(result);
        return result;
      })
      .catch((error) => false);
  };
  signup = async (id, em, pw) => {
    const signupUrl = "/api/signup/";
    console.log(id, em, pw);
    return await post(signupUrl, {
      username: id,
      email: em,
      password: pw,
    })
      .then((res) => {
        return true;
      })
      .catch(() => {
        return false;
      });
  };

  get_info = async (token) => {
    const infoUrl = "/api/userinfo";
    return await post(infoUrl, {
      token: token.token,
    })
      .then((res) => {
        const result = res.data[0];
        return result;
      })
      .catch((error) => false);
  };
  modify_username = async (token, username) => {
    const url = "/api/accounts/username/";
    return await put(url, { token: token.token, username: username })
      .then((res) => res.data[0])
      .catch((err) => false);
  };

  add_friend = async (token, username) => {
    const url = `/api/friend/`;
    const data = {
      token: token.token,
      username: username,
    };
    console.log(data);
    return await post(url, data)
      .then((res) => res.data)
      .catch((err) => false);
  };
  remove_friend = async (token, id) => {
    const url = `/api/friend/`;
    const data = {
      token: token.token,
      user_id: id,
    };
    console.log(data);
    return await del(url, data)
      .then((res) => res.data)
      .catch((err) => false);
  };
  request_dm = async (token, friend) => {
    const url = `/api/request/dm/`;
    const data = {
      token: token.token,
      user_id: friend.id,
    };
    return await post(url, data)
      .then((res) => res.data[0])
      .catch((err) => false);
  };
  get_latest_dm = async (room_name) => {
    const url = `/api/dm/get/latest?room_name=${room_name}`;
    return await get(url)
      .then((res) => res.data)
      .catch((err) => false);
  };
  set(token) {
    this.access_token = token;
  }
}
class Todo {
  get_all_projects_by_id = async (user_id) => {
    const url = "/api/accounts/get/projects/" + user_id;
    return await get(url)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return false;
      });
  };
  get_single_project_by_id = async (project_id) => {
    const url = `/api/project/get/single/${project_id}`;
  };
  make_project = async (name, token) => {
    const url = "/api/project/post/create/";
    return await post(url, { name: name, token: token.token })
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return false;
      });
  };
  delete_project = async (token, project) => {
    const url = "/api/project/delete/";
    const data = { token: token.token, project_id: project.project_id };
    return await del(url, data)
      .then((res) => {
        if (res.status == 200) {
          return res.data[0];
        } else {
          return false;
        }
      })
      .catch(() => false);
  };
  rename_project = async (token, project, name) => {
    const url = "/api/project/put/";
    const data = {
      token: token.token,
      project_id: project.project_id,
      name: name,
    };
    return await put(url, data)
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return false;
      });
  };
  joinProject = async (token, code) => {
    const url = "/api/project/post/add/user/";
    return await post(url, {
      token: token.token,
      user_id: token.user_id,
      code: code,
    })
      .then((res) => res.data[0])
      .catch((err) => false);
  };
  leave_project = async (token, project) => {
    const url = "/api/project/del/user/";
    return await del(url, {
      token: token.token,
      project_id: project.project_id,
    })
      .then((res) => res.data[0])
      .catch((err) => false);
  };
  ban_user_from_project = async (token, project, user) => {
    const url = "/api/project/ban/user/";
    return await del(url, {
      token: token.token,
      project_id: project.project_id,
      user_id: user.id,
    })
      .then((res) => res.data[0])
      .catch((err) => false);
  };
  changeRule = async (token, project_id, author_id, rule) => {
    const url = "/api/project/put/change/rule/";
    return await put(url, {
      token: token.token,
      project_id: project_id,
      author_id: author_id,
      rule: rule,
    })
      .then((res) => res.data[0])
      .catch((err) => false);
  };
  create_tag = async (token, project, code, name) => {
    const url = "/api/project/tag/";
    return await post(url, {
      token: token.token,
      project_id: project.project_id,
      code: code,
      name: name,
    })
      .then((res) => res.data[0])
      .catch((err) => false);
  };
  modify_tag = async (token, tag_id, code, name) => {
    const url = "/api/project/tag/";
    return await put(url, {
      token: token.token,
      tag_id: tag_id,
      code: code,
      name: name,
    })
      .then((res) => res.data[0])
      .catch((err) => false);
  };
  delete_tag = async (token, project_id, tag_id) => {
    const url = "/api/project/tag/";
    return await del(url, {
      token: token.token,
      tag_id: tag_id,
      project_id: project_id,
    })
      .then((res) => res.data[0])
      .catch((err) => false);
  };
  get_categories = async (project) => {
    const url = `/api/project/get/${project.project_id}/categories`;
    return await get(url)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return false;
      });
  };
  make_category = async (token, project, name) => {
    const url = "/api/project/post/category/create/";
    return await post(url, {
      project_id: project.project_id,
      category_name: name,
      token: token.token,
    })
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return false;
      });
  };
  delete_category = async (token, project, category) => {
    const url = "/api/project/post/category/delete/";
    return await post(url, {
      project_id: project.project_id,
      category_id: category.id,
      token: token.token,
    })
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return false;
      });
  };
  get_todos = async (category) => {
    const url = `/api/category/get/${category.id}/todos`;
    return await get(url)
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return false;
      });
  };
  make_todos = async (category, token, message, checklist, tag_id) => {
    const url = `/api/category/post/${category.id}/todos/create/`;
    return await post(url, {
      category_id: category.id,
      token: token.token,
      message: message,
      check_list: checklist,
      tag_id: tag_id ? tag_id : 0,
    })
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return false;
      });
  };
  modify_todos = async (token, category, todo, message) => {
    const url = `/api/category/post/${category.id}/todos/${todo.id}/modify/`;
    return await post(url, { token: token.token, message: message, todo_id: 0 })
      .then((res) => {
        return res.data[0];
      })
      .catch(() => {
        return false;
      });
  };
  delete_todos = async (token, category, todo) => {
    const url = `/api/category/post/${category.id}/todos/${todo.id}/delete/`;
    return await post(url, { token: token.token })
      .then((res) => {
        return res.data;
      })
      .catch(() => {
        return false;
      });
  };
  move_todo = async (token, todo, category) => {
    const url = `/api/todos/post/${todo.id}/move/`;
    return await post(url, {
      token: token.token,
      category_id: category.id,
    })
      .then((res) => res.data[0])
      .catch(() => false);
  };
  modify_check = async (token, check) => {
    const url = `/api/checklist/post/${check.id}/modify/`;
    return await post(url, {
      token: token.id,
      checked: !check.checked,
    })
      .then((res) => res.data[0])
      .catch(() => false);
  };
  delete_check = async (token, check) => {
    const url = `/api/checklist/post/${check.id}/delete/`;
    return await post(url, {
      token: token.id,
    })
      .then((res) => res.data[0])
      .catch(() => false);
  };
  make_check = async (token, todo, message) => {
    const url = `/api/todos/post/${todo.id}/checklist/create/`;
    return await post(url, {
      token: token.token,
      message: message,
    })
      .then((res) => res.data[0])
      .catch(() => false);
  };
  make_comment = async (token, todo, message) => {
    const url = `/api/comment/`;
    return await post(url, {
      token: token.token,
      todo_id: todo.id,
      message: message,
    })
      .then((res) => res.data[0])
      .catch(() => false);
  };
  delete_comment = async (token, comment) => {
    const url = `/api/comment/`;
    return await del(url, {
      token: token.token,
      comment_id: comment.id,
    });
  };
}
export const AUTH = new Auth();
export const TODO = new Todo();
