import React, { Component } from 'react';
import './css/index.css';
import { Button } from 'react-bootstrap';
import $ from 'jquery';

class App extends Component {
  render() {
    return (

        <div className="new-container" id="new-todo">
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css" />
            <h2>Create a new todo:</h2>
            <TodoNew/>
            <hr/>
            <h2>Todos:</h2>
            <ListTodo/>
            <Sort />
            <Page />
        </div>
    );
  }
}

class TodoNew extends Component{
    constructor(props){
        super(props);
        var now = new Date();
        var now_date = now.toLocaleDateString().replace(/\//g,"-");
        this.state = {
            description:"",
            importance:"0",
            expire_time:now_date
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleSubmit(event) {
        var submit_json = {description:this.state.description,importance:this.state.importance,expire_time:this.state.expire_time,finished:false};
        $.ajax({
            url:"http://127.0.0.1:8000/todos/",
            type:"POST",
            dataType:"json",
            async:false,
            data:submit_json,
            success: function(return_value){
                        //window.location.href;
                    },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                        alert(XMLHttpRequest.status);
            }
        });
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'radio' ? target.value : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
  }
    render(){
        return(
            <div class = "box">
            <form onSubmit={this.handleSubmit}>
                <p>Description:</p>
                <input placeholder="Create a todo" name="description" className="form-control form-control-bar" value={this.state.description} onChange={this.handleInputChange} required={true} />
                <br/>
                <p>Importance:</p>
                <label><input type="radio" name="importance" checked={this.state.importance==="0"} onChange={this.handleInputChange} value="0"/>0 not important </label>
                <label><input type="radio" name="importance" checked={this.state.importance==="1"} onChange={this.handleInputChange} value="1"/>1 important </label>
                <label><input type="radio" name="importance" checked={this.state.importance==="2"} onChange={this.handleInputChange} value="2"/>2 very important </label>
                <p>Expire Time:</p>
                <input type="date" name="expire_time" value={this.state.expire_time} onChange={this.handleInputChange}/>
                <br/>
                <Button type="submit" bsStyle="primary">Create</Button>
            </form>
            </div>
        )
    }
}

class ListTodo extends Component{
    constructor(props){
        super(props);
        this.state={
            todos:[]
        };
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'radio' ? target.value : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    render(){
        var todos = this.state.todos;
        var todolist = todos.map(
            function (todo) {

                //var expire_date = todo.expire_date;
                return(
                <TodoDetail todo = {todo} handleInputChange={todo.handleInputChange}/>
                )
            });

        return(
            <ul id="todo_list">
                {todolist}
            </ul>
        )
    }

    componentWillMount(){
        var return_value;
        const _this = this;
        $.ajax({
                async:false,
                url:"http://127.0.0.1:8000/todos/",
                type:"GET",
                dataType:"json",
            success:function (data) {
                 return_value = data;
                 _this.setState({todos:return_value});
             },
             error: function(XMLHttpRequest, textStatus, errorThrown) {
                  console.log(textStatus.responseText);
                  alert(XMLHttpRequest.status);
              }

          });

    }
}

class TodoDetail extends Component{
    constructor(props){
        super(props);
        const todo  = props.todo;
        this.state = {
            description:todo.description,
            importance:todo.importance,
            expire_time:todo.expire_date,
            finished:todo.finished
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'radio' ? target.value : target.value;
        const name = target.name;
        this.setState({
          [name]: value
        });
    }

    handleDelete() {
                    var id = this.props.todo.id;
                    var delete_url = "http://127.0.0.1:8000/todos/"+id+"/";
                    $.ajax({
                        url:delete_url,
                        type:"DELETE",
                        dataType:"json",
                        async:false,
                        success: function(return_value){
                                    //window.location.href;
                                },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    alert(XMLHttpRequest.status);
                        }
                    });
                }

    render(){
        const todo = this.props.todo;
        return(
            <div id ={todo.id} className= "list_container">
                    <form>
                        <h3>Finished: <input type="checkbox" checked={todo.finished}/></h3>
                        <p>Description:</p>
                        <input placeholder="Create a todo" id="description" className="form-control" ref="inputnew" value={this.state.description} required={true} />
                        <br/>
                        <p>Importance:</p>
                        <label><input type="radio" name="importance" checked={this.state.importance===0} onChange={this.state.handleInputChange}/>0 not important </label>
                        <label><input type="radio" name="importance" checked={this.state.importance===1} onChange={this.state.handleInputChange}/>1 important </label>
                        <label><input type="radio" name="importance" checked={this.state.importance===2} onChange={this.state.handleInputChange}/>2 very important </label>
                        <p>Expire Time:</p>
                        <input type="date" defaultValue={this.state.expire_time}/>
                        <br/>
                        <Button type="submit" bsStyle="danger" onClick={this.handleDelete}>Delete</Button>
                    </form>
                    <hr/>
                </div>
        )
    }
}

class Sort extends Component{
    render(){
        return(
            <div class="box" align="right">
                Sort by:  &nbsp;
                <select name="sort_method">
                    <option value="0" >Importance</option>
                    <option value="1" >Expire time</option>
                </select>
                &nbsp;
                <Button bsStyle="primary">Sort</Button>
            </div>
        )
    }
}

class Page extends Component{
    render(){
        return(
            <div class="box" align="right">
                <Button bsStyle="info">Previous</Button>
                &nbsp;
                <Button bsStyle="info">Next</Button>
            </div>
        )
    }
}

export default App;
