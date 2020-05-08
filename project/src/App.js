import React ,{Component} from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation.js';
import Logo from './Components/Logo/Logo';
//import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
//import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
//import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import RegisterForm from './Components/Register/RegisterForm';
import 'bootstrap/dist/css/bootstrap.css';
import 'jquery';
//import Appp from './Components/todo/App'



                            /* ----------- BUTTONS START ----------- */
              class ButtonGroup extends React.Component {
                render() {
                  return (
                      <div className="btn-group btn-group-sm">
                        {this.props.buttons}
                      </div>
                  );
                }
              }

              class EditButton extends React.Component {
                render() {
                  return (
                    <button type="button" onClick={this.props.onClick} className="edit btn btn-default mt-2 fas fa-edit dim" ><span className="glyphicon glyphicon-pencil"></span></button>
                  );
                }
              }

              class DeleteButton extends React.Component {
                render() {
                  return (
                    <button type="button" onClick={this.props.onClick} className="edit btn btn-default mt-2 fas fa-trash-alt dim" ></button>
                  );
                }
              }

              class ConfirmButton extends React.Component {
                render() {
                  return (
                    <button type="button" onClick={this.props.onClick} className="edit mt-3 mr-2 ml-2 bg-green f6 link dim br-pill ba bw1 ph3 pv2 mb2 dib white fas fa-check" ></button>
                  );
                }
              }

              class CancelButton extends React.Component {
                render() {
                  return (
                    <button type="button" onClick={this.props.onClick} className="edit mt-3 mr-2 ml-2 bg-red f6 link dim br-pill ba bw1 ph3 pv2 mb2 dib white fas fa-times" ><span className="glyphicon glyphicon-remove"></span></button>
                  );
                }
              }

              class FullWidthButton extends React.Component {
                render() {
                  return (
                    <button type="button" onClick={this.props.onClick} className="btn f6 fw6 ttu tracked ph3 f6 link dim ph3 pv2 mb2 dib black bg-light-gray w-10" >{this.props.buttontext}</button>
                  );
                }
              }

              class FullWidthLinkButton extends React.Component {
                render() {
                  if (this.props.disabled) {
                    var class_name = "btn btn-default  disabled"
                  } else {
                    var class_name = "btn btn-default "
                  }
                  return (
                    <a href={this.props.link} className={class_name}>{this.props.buttontext}</a>
                );
                }
              }
              /* ----------- BUTTONS END ----------- */

              class DisplayField extends React.Component {
                render() {
                  return (
                    <td className="tl" onClick={this.props.onClick}>{this.props.field.value}</td>
                  );
                }
              }

              class EditField extends React.Component {
                constructor(props) {
                  super(props);
                  this.state = {
                    value: this.props.field.value
                  };
                  this.handleFieldChange = this.handleFieldChange.bind(this);
                }
                handleFieldChange(e) {
                  this.setState({
                    value: e.target.value
                  });
                  // Send value back to row - note: state is too slow
                  this.props.sendValueToParent(this.props.field.name, e.target.value);
                }
                render() {
                  return (
                    <td>
                      <input 
                        className="form-control input-sm"
                        type="text"
                        value={this.state.value}
                        placeholder={this.props.field.placeholder}
                        onChange={this.handleFieldChange}>
                      </input>
                    </td>
                  );
                }
              }

              class TableRow extends React.Component {
                constructor(props) {
                  super(props);
                  
                  this.handleSelectRow = this.handleSelectRow.bind(this);
                  this.handleEditModeClick = this.handleEditModeClick.bind(this);
                  this.handleExitEditModeClick = this.handleExitEditModeClick.bind(this);
                  this.handleDeleteClick = this.handleDeleteClick.bind(this);
                  this.handleConfirmEditClick = this.handleConfirmEditClick.bind(this);
                  this.updateValues = this.updateValues.bind(this);
                  
                  var editMode = false;
                  var added = false;
                  // If no created date then row is a newly added row
                  if (!this.props.instance.date_created) {
                    editMode = true;
                    added = true;
                  }
                  var instance = {};
                  this.props.fielddata.forEach(function(fd) {
                    instance[fd.name] = this.props.instance[fd.name];
                  }, this);
                  instance.id = this.props.instance.id;
                  this.state = {
                    editMode: editMode,
                    instance: instance,
                    revised_instance: instance,
                    deleted: false,
                    added: added,
                    selected: false
                  };
                }

                handleSelectRow() {
                  // Need a call to parent as only one row may be selected?
                  if (!this.state.selected) {
                    this.setState({ selected: true });
                  } else {
                    this.setState({ selected: false });
                  }
                  this.props.setSelectedRow(this.props.instance.id);
                }
                
                handleEditModeClick() {
                  this.setState({ editMode: true });
                }

                handleExitEditModeClick() {
                  this.setState({ editMode: false });
                  this.setState({
                    revised_instance: this.state.instance
                  });
                  if (this.state.added) {
                    this.setState({deleted: true});
                  }
                }

                handleDeleteClick() {
                  this.setState({deleted:true});
                  console.log("AJAX DELETE");
                  console.log(this.state.instance.id);
                }

                handleConfirmEditClick() {
                  // CONFIRM revised_instance
                  this.setState({
                    editMode: false,
                    instance: this.state.revised_instance
                  });
                  if (this.state.added) {
                    console.log("AJAX POST");
                    //console.log(revised_instance);
                  }
                  else {
                    console.log("AJAX PATCH");
                    //console.log(revised_instance);
                    // Reset added flag
                    this.setState({added:false});
                  }
                }

                updateValues(key, value) {
                  // Method to update values passed from EditField
                  var temp_revised_instance = this.state.revised_instance;
                  temp_revised_instance[key] = value;
                  this.setState({
                    revised_instance: temp_revised_instance
                  });
                }

                render() {
                  let row = [];
                  let buttons = null;
                  if (this.state.deleted) {
                    return <tr></tr>;
                  }
                  if (this.state.editMode) {
                    // In edit mode - set buttons for edit 
                    buttons = [<ConfirmButton onClick={this.handleConfirmEditClick}/>, <CancelButton onClick={this.handleExitEditModeClick}/>];
                    // In edit mode - set field values and placeholders
                    this.props.fielddata.forEach(function(fd) {
                      var field = {
                        name : fd.name,
                        placeholder : fd.placeholder,
                        value : this.state.instance[fd.name]
                      };
                      // In edit mode - add EditFields for editable fields
                      if (fd.inputfield) {
                        row.push(<EditField field={field} key={field.name} sendValueToParent={this.updateValues}/>);
                      } else {
                        row.push(<DisplayField onClick={""} field={""} key={field.name}/>)
                      }
                    }, this);
                  } else {
                    // In display mode - add edit/delete buttons
                    buttons = [<EditButton onClick={this.handleEditModeClick}/>, <DeleteButton onClick={this.handleDeleteClick}/>];
                    // In display mode - add DisplayField
                    this.props.fielddata.forEach(function(fd) {
                      var field = {
                        name: fd.name, 
                        value: this.state.instance[fd.name]
                      };
                      row.push(<DisplayField onClick={this.handleSelectRow} field={field} key={field.value}/>);
                    }, this);
                  }
                  // Set selected status
                  if (this.props.instance.selected) {
                    return (
                      <tr className="success">{row}<ButtonGroup buttons={buttons}/></tr>
                    ); 
                  } else {
                    return (
                      <tr>{row}<ButtonGroup buttons={buttons}/></tr>
                    ); 
                  }
                }

              }

              class TableHeader extends React.Component {
                render() {
                  var tableheaders = [];
                  this.props.fielddata.forEach(function(fd) {
                    tableheaders.push(<th>{fd.header}</th>)
                  });
                  tableheaders.push(<th className="buttoncolumn">Actions</th>);
                  return (
                    <tr>
                      {tableheaders}
                    </tr>
                  );
                }
              }

              class Table extends React.Component {
                constructor(props) {
                    super(props);
                    // Set state variable for selected row
                    this.state = {
                      selected: 0
                    };
                    this.setSelectedRow = this.setSelectedRow.bind(this);
                  }
                
                setSelectedRow(id) {
                  this.setState({selected:id});
                  console.log(id);
                  this.props.data.instances.forEach(function(instance) {
                    if (instance.id == id) {
                      console.log(instance.childlinks);
                      this.props.onSelect(instance.childlinks);
                    }
                  }, this);
                }
                
                render() {
                  var rows = [];
                  const fielddata = this.props.data.fielddata;
                  this.props.data.instances.forEach(function(instance) {
                    if (instance.id == this.state.selected) {
                      instance.selected = true;
                    } else {
                      instance.selected = false;
                    }
                    rows.push(<TableRow setSelectedRow={this.setSelectedRow} instance={instance} fielddata={fielddata} key={instance.id} />);
                  }, this);
                  return (
                    <table className="table table-striped">
                      <thead><TableHeader fielddata={fielddata}/></thead>
                      <tbody>{rows}</tbody>
                    </table>
                  );
                }
              }

              class ChildLinks extends React.Component {
                render() {
                  var render_links = [];
                  /*
                  this.props.childlinks.forEach(function(cl) {
                    if (cl.uri) {
                      render_links.push(<FullWidthLinkButton buttontext={cl.name} link={""} disabled={false}/>);
                    } else {
                      render_links.push(<FullWidthLinkButton buttontext={cl.name} link={cl.uri} disabled={true}/>);  
                    }
                  }, this);
                  */
                  return (
                      <div id="childLinks" class="row ml-4">
                        {render_links}
                      </div>
                  );
                }
              }

              class TableContainer extends React.Component {
                  constructor(props) {
                    super(props);
                    this.state = {
                      addMode: false,
                      childlinks: this.props.data.childlinks
                    };
                    this.handleAddClick = this.handleAddClick.bind(this);
                    this.setChildlinks = this.setChildlinks.bind(this);
                    this.getData();
                  }
                
                  handleAddClick() {
                    this.setState({ addMode: true });
                  }
                
                  getData() {
                    console.log("AJAX GET");
                  }
                  
                  setChildlinks(childlinks) {
                    this.setState({childlinks: childlinks});
                    // This is too slow - we need to call
                    // a method to update directly on childlinks as passed, which is correct
                    console.log(this.state.childlinks);
                  }
                
                  render() {
                    if (this.state.addMode) {
                      var instance = {};
                      this.props.data.fielddata.forEach(function(fd) {
                        instance[fd.name] = "";
                      });
                      var dataout = this.props.data;
                      dataout.instances.push(instance);
                    }
                    else {
                      dataout = this.props.data;
                    }
                    if (dataout.instances.length > 0) {
                      
                    }
                    return (
                      <div>
                        <div className="table-responsive mt-5">
                          <legend>{this.props.title}</legend>
                          <Table data={dataout} onSelect={this.setChildlinks}/>
                          <br/>
                          <FullWidthButton className="pr-2" buttontext={"ajout de phase"} onClick={this.handleAddClick} />
                          <br/>
                          <FullWidthButton className="ml-2" buttontext={"esmtimation de charge"}  />
                      </div>
                      <hr/>
                      <ChildLinks childlinks={this.state.childlinks}/>
                      <hr/>
                    </div>
                    );
                  }
                }
                // Need to add a class name at level of fieldata / instances
              var data = {
                "api_uri": "https://www.benhoyle.co.uk/attass/oar/cases/data/",
                "childlinks":[
                  {"name": "Office Actions", "uri":""},
                  {"name": "Application States", "uri":""},
                  {"name": "Cited Art", "uri":""}
                ],
                "fielddata": [{
                  "header": "Phases et taches",
                  "inputfield": true,
                  "length": 10,
                  "name": "caseref",
                  "placeholder": "e.g. phase 1, tache 2"
                }, {
                  "header": "les charges",
                  "inputfield": true,
                  "length": 10,
                  "name": "appln_no",
                  "placeholder": "e.g. 123456"
                }, {
                  "header": "Avancement",
                  "inputfield": true,
                  "length": 7,
                  "name": "countrycode",
                  "placeholder": "e.g. 15%"
                }, {
                  "header": "Derniere Modification",
                  "inputfield": false,
                  "length": 10,
                  "name": "date_modified",
                  "placeholder": ""
                }],
                "instances": [{
                  "appln_no": "12881603.0",
                  "caseref": "phase 1, tache 1",
                  "childlinks": [{
                    "name": "Office Actions",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/officeactions/?parent_id=2"
                  }, {
                    "name": "Application States",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/applnstates/?parent_id=2"
                  }, {
                    "name": "Cited Art",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/citedart/?parent_id=2"
                  }],
                  "countrycode": "80%",
                  "date_created": "04 July 2016",
                  "date_modified": "04 July 2016",
                  "filing_date": null,
                  "id": 2,
                  "pub_date": "03 June 2015",
                  "pub_no": "EP2877953",
                  "uri": "https://www.benhoyle.co.uk/attass/oar/cases/data/2"
                }, {
                  "appln_no": "79300903.6",
                  "caseref": "phase 1 tache 2",
                  "childlinks": [{
                    "name": "Office Actions",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/officeactions/?parent_id=1"
                  }, {
                    "name": "Application States",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/applnstates/?parent_id=1"
                  }, {
                    "name": "Cited Art",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/citedart/?parent_id=1"
                  }],
                  "countrycode": "12%",
                  "date_created": "01 June 2016",
                  "date_modified": "11 July 2016",
                  "filing_date": null,
                  "id": 1,
                  "pub_date": null,
                  "pub_no": null,
                  "uri": "https://www.benhoyle.co.uk/attass/oar/cases/data/1"
                }, {
                  "appln_no": "1324250.1",
                  "caseref": "phase 2 tache 1",
                  "childlinks": [{
                    "name": "Office Actions",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/officeactions/?parent_id=3"
                  }, {
                    "name": "Application States",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/applnstates/?parent_id=3"
                  }, {
                    "name": "Cited Art",
                    "uri": "https://www.benhoyle.co.uk/attass/oar/citedart/?parent_id=3"
                  }],
                  "countrycode": "35%",
                  "date_created": "11 November 2016",
                  "date_modified": "11 November 2016",
                  "filing_date": null,
                  "id": 3,
                  "pub_date": null,
                  "pub_no": null,
                  "uri": "https://www.benhoyle.co.uk/attass/oar/cases/data/3"
                }]
              };

              // ReactDOM.render(
              //   <TableContainer title="Case View" data={data}/>,
              //   document.getElementById("container")
              // );


              var todoItems = [];
              todoItems.push({index: 1, value: "étape 1", done: true});
              todoItems.push({index: 2, value: "étape 2", done: false});
              todoItems.push({index: 3, value: "étape 3", done: false});
              todoItems.push({index: 4, value: "étape 4", done: false});
              //todoItems.push({index: 5, value: "étape 5", done: false});

              class TodoList extends React.Component {
                render(){
                  var items = this.props.items.map((item,index) =>{
                    return(
                      <TodoListItem key={index} item={item} index={index} removeItem={this.props.removeItem} markTodoDone={this.props.markTodoDone} />
                    );
                  });
                  return(
                    <ul className="list-group">{items}</ul>
                  );
                }
              }

              class TodoListItem extends React.Component {
                constructor(props){
                  super(props);
                  this.onClickClose = this.onClickClose.bind(this);
                  this.onClickDone = this.onClickDone.bind(this);
                }
                onClickClose(){
                  var index = parseInt(this.props.index);
                  this.props.removeItem(index);
                }
                onClickDone(){
                  var index = parseInt(this.props.index);
                  this.props.markTodoDone(index);
                }
                render(){
                  var todoClass = this.props.item.done ? "done":"undone";
                  return(
                    <li className="list-group-item">
                      <div className={todoClass}>
                        <span className="fas fa-check green" onClick={this.onClickDone}></span>
                        {this.props.item.value}
                        <button type="button" className="close" onClick={this.onClickClose}>&times;</button>
                      </div>
                    </li>
                  );
                }
              }

              class TodoForm extends React.Component {
                constructor(props) {
                  super(props);
                  this.onSubmit = this.onSubmit.bind(this);
                }
                componentDidMount(){
                  this.refs.itemName.focus();
                }
                onSubmit(event){
                  event.preventDefault();
                  var newItemValue = this.refs.itemName.value;
                  if(newItemValue){
                    this.props.addItem({newItemValue});
                    this.refs.form.reset();
                  }
                }
                render(){
                  return(
                    <form ref="form" onSubmit={this.onSubmit} className="form-inline">
                      <input type="text" ref="itemName" className="form-control" placeholder="ajouter une étape..." />
                      <button type="submit" className="btn btn-default"></button>
                    </form>
                  )
                }
              }

              class TodoHeader extends React.Component {
                render(){
                  return(
                    <div>
                    <div className="wid">

                    </div>
                    <h3 className="title">Les étapes du projet</h3>
                    </div>
                  )
                }
              }

              class TodoApp extends React.Component {
                constructor(props) {
                  super(props);
                  this.addItem = this.addItem.bind(this);
                  this.removeItem = this.removeItem.bind(this);
                  this.markTodoDone = this.markTodoDone.bind(this);
                  this.state = {todoItems: todoItems};
                }
                addItem(todoItem){
                  todoItems.unshift({
                    index: todoItems.length+1,
                    value: todoItem.newItemValue,
                    done: false
                  });
                  this.setState({todoItems: todoItems});
                }
                removeItem(itemIndex){
                  todoItems.splice(itemIndex,1);
                  this.setState({todoItems: todoItems});
                }
                markTodoDone(itemIndex){
                  var todo = todoItems[itemIndex];
                  todoItems.splice(itemIndex,1);
                  todo.done = !todo.done;
                  todo.done ? todoItems.push(todo) : todoItems.unshift(todo);
                  this.setState({todoItems: todoItems});
                }
                render(){
                  return(
                    <div className="todoForm">
                      <TodoHeader />
                      <TodoForm addItem={this.addItem} />
                      <TodoList items={todoItems} removeItem={this.removeItem} markTodoDone={this.markTodoDone} />
                    </div>
                  )
                }
              }

              //ReactDOM.render(<TodoApp />,document.getElementById('todo'));
                  


const app = new Clarifai.App({
  apiKey: '72f6e43413e3476fb23253a4fc3345ad'
 });

class App extends Component {  
  constructor(){
    super();
    this.state = {
      input:'',
      imageUrl:'',
      box:{},
      route:'signIn',
      isSignedIn: false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined: ''
      }
    }
  }

  loadUser = (data) =>{
    this.setState({user: {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLoacation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height);   
    return {
      leftCol : clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol : width - (clarifaiFace.right_col * width),
      bottomRow : height - (clarifaiFace.bottom_row * height),
    } 
    
  }

  displayFaceBox = (b) => {
    //console.log(box);
    this.setState({box:b});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    //console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
    this.setState({imageUrl :this.state.input});
    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
    .then(response => {
      if(response){
        fetch('http://localhost/3000/image',{
          method : 'put',
          headers : {'Content-Type' : 'application/json'},
          body : JSON.stringify({
            id : this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count =>{
          this.setState(Object.assign(this.state.user,{entries : count}))
        })
      }
        this.displayFaceBox(this.calculateFaceLoacation(response))
    })
    .catch(err => console.log(err));
  
  }

  onRouteChange = (route) =>{
    if(route==='signOut'){
      this.setState({isSignedIn:false})
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }



  render(){
    return (
      <div className="App">
        
        <Navigation isSignedIn={this.state.isSignedIn} onRoutChange={this.onRouteChange} />
        {  
        this.state.route === 'home'?
        <div>
            <Logo />
            <TodoApp />
            <TableContainer title="liste des phases" data={data}/>
        </div>
        :(
          this.state.route === 'register' ? <RegisterForm loadUser={this.loadUser} onRouteChange={this.onRouteChange} /> :
          <div>
            <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          </div>
        )
        
        }
        
        <Particles 
            params={{
              particles: {
                number:{
                  value:200,
                }
              }
            }}
            style={{
              width: '100%',
              position:'fixed',
              top:'0',bottom:'0',right:'0',left:'0',
              zIndex: '-1'
            }}
        />
      </div>
  );
        }
}
//after logo
/*
          <Rank name ={this.state.user.name} entries = {this.state.user.entries}/>
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit} />
          <FaceRecognition imageUrl = {this.state.input} box={this.state.box}/>
*/
export default App;
