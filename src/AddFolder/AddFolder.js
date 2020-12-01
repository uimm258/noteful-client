import React, { Component } from "react";
import ApiContext from "../ApiContext";
import config from '../config';
import ValidateError from '../ValidateError';
import PropTypes from 'prop-types';
import '../AddFolder/AddFolder.css';

export default class AddFolder extends Component {
  static contextType = ApiContext;

  constructor(props){
    super(props);
    this.state={
      folderName:{
        value: '',
        touched: false
      }
    }
  }

  updateFolderName(foldername){
    this.setState({
      folderName:{
        value: foldername, 
        touched: true
      }
    })
  }

  handleSumitFolder = (event) =>{
    event.preventDefault();
    let nameError=this.validateName();
    const foldername=this.state.folderName.value;
    if(nameError){
      this.setState({
        folderName:{
          value:foldername, 
          touched:true}
      })
      return
    }

    fetch(`${config.API_ENDPOINT}/folders/`, {
      method: 'POST',
      headers:{
        'content-type': 'application/json'
      },
      body: JSON.stringify({'name': foldername})
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data)
      this.context.addFolder(data)
      this.props.history.push('/')
    })
    .catch(error=>console.log(error))
  }

  
  //validate folder name
  validateName(){
    const folderName = this.state.folderName.value.trim()
    if(folderName.length === 0){
      return 'Name is required'
    } else if(folderName.length < 3){
      return 'Name must be at least 3 characters long';
    }
  }


  render() {
    const nameError = this.validateName();
    return (
      <div>
        <h2>Add A New Folder</h2>

        <form className="add-folder" onSubmit={e=>this.handleSumitFolder(e)}> 
          <label htmlFor="name" className="user">
          {this.state.folderName.touched && (
          <ValidateError message={nameError} />
          )}
          </label>
          
          <input 
            type="text" 
            className="folder-name"
            name="folder-name" 
            id="folder-name" 
            onChange={e => this.updateFolderName(e.target.value)}
            required/>
          
          <button 
            type="submit" 
            className="add-folder-button">
            Submit</button>
          
        </form>
      </div>
    );
  }
}


AddFolder.propTypes = {
  history: PropTypes.object
}