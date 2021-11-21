import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";
import { FaEdit } from "react-icons/fa";

const getLocalList = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return JSON.parse(localStorage.getItem("list"));
  } else {
    return [];
  }
};

const getLocalTitle = () => {
  let title = localStorage.getItem("title");
  if (title) {
    return JSON.parse(localStorage.getItem("title"));
  } else {
    return "List with persistence";
  }
};

function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalList());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleHeading, setTitleHeading] = useState(getLocalTitle());

  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, "danger", "value is missing");
    } else if (name && isEditing && !isEditingTitle) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      setName("");
      setEditID(null);
      setIsEditing(false);
      showAlert(true, "success", "value is changed");
    } else if (name && isEditing && isEditingTitle) {
      setTitleHeading(name);
      setName("");
      setIsEditing(false);
      setIsEditingTitle(false);
      showAlert(true, "success", "title is changed");
    } else {
      showAlert(true, "success", "value is added");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };

  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };

  const clearList = () => {
    showAlert(true, "danger", "list is deleted");
    setList([]);
  };

  const removeItem = (id) => {
    showAlert(true, "danger", "value is deleted");
    setList(list.filter((item) => item.id !== id));
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  const editTitle = () => {
    setIsEditing(true);
    setIsEditingTitle(true);
    setName(titleHeading);
  };

  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);

  useEffect(() => {
    localStorage.setItem("title", JSON.stringify(titleHeading));
  }, [titleHeading]);

  return (
    <section className="section-center">
      <form className="todo-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>
          {titleHeading}
          <button type="button" className="edit-title-btn" onClick={editTitle}>
            <FaEdit />
          </button>
        </h3>
        <div className="form-control">
          <input
            type="text"
            className="todo"
            placeholder="enter item/idea/etc..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "edit" : "Add"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="todo-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>
            clear list
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
