import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  getAllProjects,
  getAllTasks,
  updateNewProjectTitle
} from './../../ducks/reducers/dashboardReducer';
import Header from '../Header/Header';

import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toolTip: false
    };
    this.createProjectToolTip = this.createProjectToolTip.bind(this);
    this.sendNewProject = this.sendNewProject.bind(this);
  }
  componentDidMount() {
    this.props.getAllProjects();
    this.props.getAllTasks();
  }

  // changes local state to allow tooltip to popup on create new project
  createProjectToolTip() {
    this.setState({ toolTip: !this.state.toolTip });
  }

  //sends new project title from redux and the user.id to the database to create a new project
  //then routes to the project view with the new projects id
  sendNewProject(e) {
    e.preventDefault();
    axios.post('http://localhost:3001/api/addProject', { projectTitle: this.props.newProjectTitle, id: 1 }).then(response => {
      this.props.history.push(`/ProjectView/${response.data[0].id}`)
    });
  }

  render() {
    //On page load a box is created and displays information for each project
    const projectBox = this.props.projects.map((project, index) => {
      return (
        <div className="box" key={index}>
          <div>{project.title}</div>
          <div>{project.owner_id}</div>
          <div>{project.created_at}</div>
          <div>{project.updated_at}</div>
        </div>
      );
    });

    //creates a tooltip to allow the entry of a project title, form allows for enter to add to database and route to project view
    const projectToolTip = (
      <div className="projectToolTip">
        <h3>Project Title</h3>
        <form onSubmit={e => this.sendNewProject(e)}>
          <input onChange={e => this.props.updateNewProjectTitle(e)} />
        </form>
      </div>
    );

    return (
      <div>
        <Header />
        <div className="projectContainer">
          <div className="box" onClick={() => this.createProjectToolTip()}>
            <div>Create a project!</div>
          </div>
          {this.state.toolTip && projectToolTip}
          {this.props.projects && projectBox}
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => state.dashboard;

export default connect(mapStateToProps, {
  getAllProjects,
  getAllTasks,
  updateNewProjectTitle
})(Dashboard);
