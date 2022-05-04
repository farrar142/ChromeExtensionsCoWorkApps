export default function todoCan(todo) {
  return {
    id: todo.id,
    author_name: todo.author_name,
    author_id: todo.author_id,
    category_id: todo.category_id,
    message: todo.message,
    checkList: todo.checklist.filter((res) => res.id != null),
    comment: todo.comment.filter((res) => res.id != null),
    tag: todo.color_id,
  };
}
