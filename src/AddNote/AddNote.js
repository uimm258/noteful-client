import React, { Component } from "react";
import ApiContext from "../ApiContext";
import config from "../config";
import ValidateError from "../ValidateError";
import "../AddNote/AddNote.css";
import PropTypes from "prop-types";

export default class AddNote extends Component {
  static contextType = ApiContext;

  constructor(props) {
    super(props);
    this.state = {
      noteName: {
        value: "",
        touched: false,
      },
      content: {
        value: "",
        touched: false,
      },
      folderId: " ",
    };
  }

  updateNoteName(noteName) {
    this.setState({
      noteName: {
        value: noteName,
        touched: true,
      },
    });
  }

  updateNoteContent(content) {
    this.setState({
      content: {
        value: content,
        touched: true,
      },
    });
  }

  handleSumiteNote = (event) => {
    event.preventDefault();
    let nameError = this.validateName();
    let contentError = this.validateContent();
    const noteName = this.state.noteName.value;
    const content = this.state.content.value;
    const modified = new Date();
    const folderID = event.currentTarget.querySelector("select").value;
    if (nameError) {
      this.setState({
        noteName: {
          value: noteName,
          touched: true,
        },
      });
      return;
    }
    if (contentError) {
      this.setState({
        content: {
          value: content,
          touched: true,
        },
      });
      return;
    }

    fetch(`${config.API_ENDPOINT}/notes/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: noteName,
        content: content,
        folderId: folderID,
        modified,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.context.addNote(data);
        this.props.history.push("/");
      })
      .catch((error) => console.log(error));
  };

  validateName() {
    const noteName = this.state.noteName.value.trim();
    if (noteName.length === 0) {
      return "Name is required";
    }
  }

  validateContent() {
    const content = this.state.content.value.trim();
    if (content.length === 0) {
      return "Content is required";
    }
  }

  folderOption = () => {
    const { folders } = this.context;
    return folders.map((folder) => (
      <option key={folder.id} name={folder.id} value={folder.id}>
        {folder.name}
      </option>
    ));
  };

  render() {
    const nameError = this.validateName();
    const contentError = this.validateContent();
    return (
      <div className="add-note">
        <h2>Add A New Note</h2>

        <form className="add-note" onSubmit={(e) => this.handleSumiteNote(e)}>
          <div className="add-note-name">
            <p>Add Name Here</p>
            <label htmlFor="note-name" className="note-name">
              {this.state.noteName.touched && (
                <ValidateError message={nameError} />
              )}
            </label>
            <input
              type="text"
              className="note-name"
              onChange={(e) => this.updateNoteName(e.target.value)}
              required
            />
          </div>

          <div className="add-note-content">
            <p>Add Content Here</p>
            <label htmlFor="content" className="content">
              {this.state.content.touched && (
                <ValidateError message={contentError} />
              )}
            </label>
            <input
              type="text"
              className="add-content"
              onChange={(e) => this.updateNoteContent(e.target.value)}
              required
            />
          </div>
          <p>Select A Folder</p>
          <select className="select-folder">{this.folderOption()}</select>

          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}

AddNote.propTypes = {
  history: PropTypes.object,
};