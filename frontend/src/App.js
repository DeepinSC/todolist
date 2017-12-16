import React, { Component } from 'react';
import './css/index.css';
import { Button } from 'react-bootstrap';
import $ from 'jquery';



//排序组件
class Sort extends Component{
    constructor(props){
        super(props);
        this.state = {
            sort_method:props.sort_method
        }
    }

    render(){
        return(
            <div className="box" align="right">
                Sort by:  &nbsp;
                <input type="radio" name="sort_method" defaultChecked={this.state.sort_method===0} onChange={this.props.handleStateChange} value="0"/>
                <label> Importance</label>
                <input type="radio" name="sort_method" defaultChecked={this.state.sort_method===1} onChange={this.props.handleStateChange} value="1"/>
                <label> Expire time</label>
                &nbsp;
            </div>
        )
    }
}

//翻页组件
class Page extends Component{
    constructor(props){
        super(props);
        this.state = {
            pages:props.pages
        }
    }


    render(){
        return(
            <div className="box" align="right">
                <div>Pages: {this.props.current_page}/{this.props.max_page} </div>
                <button className="btn btn-info btn-op" name="pages" value="previous" onClick={this.props.handlePageChange}><i className="fa fa-chevron-left"></i> Previous</button>
                &nbsp;
                <button className="btn btn-info btn-op" name="pages" value="next" onClick={this.props.handlePageChange}><i className="fa fa-chevron-right"></i> Next</button>
            </div>
        )
    }
}

//根组件
class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            pages:1,
            sort_method:0,
            total_todos:0
        };
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    }


    handleStateChange(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
        [name]: value
        }
        );
    }
    handlePageChange(event){
        const target = event.target;
        const value = (target.value==="next")?1:-1;
        const current_page = this.state.pages;
        this.setState({
        pages: (current_page+value)>0?current_page+value:current_page
        }
        );
        console.log(this.state.pages);
    }


  render() {
    return (
        <div  id="new-todo">

            <h2>Create a new todo :</h2>
            <p>You are able to set a new todo with Descrption/Importance/Expire Time.</p>
            <p><b>Note: If a todo has expired, you are forbidden to edit its props except expire time.</b></p>
            <TodoNew/>
            <hr/>
            <h2>Todos:</h2>
            <Sort sort_method={this.state.sort_method} handleStateChange={this.handleStateChange} />
            <ListTodo sort_method={this.state.sort_method} pages={this.state.pages} handlePageChange={this.handlePageChange}/>

        </div>
    );
  }
}


//todo创建组件
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
    handleSubmit() {
        var submit_json = {description:this.state.description,
            importance:this.state.importance,
            expire_time:this.state.expire_time,
            finished:false};
        console.log(this.state.expire_time);
        $.ajax({
            url:"http://127.0.0.1:8000/todos/",
            type:"POST",
            dataType:"json",
            async:false,
            data:submit_json,
            success: function(return_value){
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

            <div className = "content-block parallax" id="services">
            <div className="container">
            <form onSubmit={this.handleSubmit}>
                <h1 className="text-center">Create Your New Todo</h1>
                <h2>Description:</h2>
                <input placeholder="Create a todo" name="description" className="form-control form-group form-control-white" value={this.state.description} onChange={this.handleInputChange} required={true} />
                <br/>
                <h2>Importance:</h2>
                <input type="radio" name="importance" className="form-group "  checked={this.state.importance==="0"} onChange={this.handleInputChange} value="0"/><label>0 not important &nbsp;</label>
                <input type="radio" name="importance" className="form-group"  checked={this.state.importance==="1"} onChange={this.handleInputChange} value="1"/><label>1 important &nbsp;</label>
                <input type="radio" name="importance" className="form-group"  checked={this.state.importance==="2"} onChange={this.handleInputChange} value="2"/><label>2 very important &nbsp;</label>
                <h2>Expire Time:</h2>
                <input type="date" name="expire_time" className="form-group form-control form-control-white" value={this.state.expire_time} onChange={this.handleInputChange}/>
                <br/>
                <button type="submit" className="btn btn-o btn-lg">Create</button>
            </form>
            </div>
            </div>
        )
    }
}

//todo详情组件
class TodoDetail extends Component{
    constructor(props){
        super(props);
        this.state = {
            description:props.todo.description,
            importance:props.todo.importance,
            expire_time:props.todo.expire_date,
            finished:props.todo.finished
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.is_expired = this.is_expired.bind(this);
    }

    is_expired(){
        const today=new Date();
        const expire_date = new Date(this.state.expire_time);
        return expire_date<today;
    }

    get_status(){
        if (this.is_expired())
            return "Expired";
        if (this.state.finished)
            return "Finished";
        return "Unfinished";
    }

    //todo删除函数
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
            <div className= "list_container">
                    <form id ={todo.id}>
                        <div className="title_bar">
                        <h3 className="todo_detail">Finished: </h3>
                        <input type="checkbox" name="finished" className="finished-checkbox form-group" defaultChecked={this.state.finished} disabled={this.is_expired()} onChange={this.props.handleInputChange}/>
                        <h4 className="todo_detail_right">Status: {this.get_status()}</h4>
                        </div>
                        <br/>
                        <div>
                        <h3 >Description: </h3>
                        <input placeholder="Create a todo" name="description" className="form-control form-group form-control-white" ref="inputnew" defaultValue={this.state.description} onChange={this.props.handleInputChange} disabled={this.is_expired()} required={true} />
                        <br/>
                        <h3>Importance: </h3>
                        <input type="radio" name="importance"  className="form-group" defaultChecked={this.state.importance===0} onChange={this.props.handleInputChange} disabled={this.is_expired()} value="0"/><label>0 not important </label>
                        <input type="radio" name="importance" className="form-group" defaultChecked={this.state.importance===1} onChange={this.props.handleInputChange} disabled={this.is_expired()} value="1"/><label>1 important </label>
                        <input type="radio" name="importance" className="form-group" defaultChecked={this.state.importance===2} onChange={this.props.handleInputChange} disabled={this.is_expired()} value="2"/><label>2 very important </label>
                        <br/>
                        <h3>Expire Time: </h3>
                        <input type="date" name="expire_date" className="form-control form-group form-control-white" defaultValue={this.state.expire_time} onChange={this.props.handleInputChange}/>
                        </div>
                        <div>
                            &nbsp; <button type="submit" className="btn btn-danger btn-op" onClick={this.handleDelete}><i className="fa fa-trash"></i> Delete</button>
                        </div>

                    </form>
                </div>
        )
    }
}

//todo列表组件
class ListTodo extends Component{
    constructor(props){
        super(props);
        this.state={
            todos:[],
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        let value=target.value;
        if(target.type === 'checkbox') {
            value = target.checked;
        }
        const name = target.name;
        const target_id = target.parentNode.parentNode.id;
        let todos_after = this.state.todos;
        const index = todos_after.findIndex(todo=>(todo.id==target_id));
        todos_after[index][name]=value;
        const url = todos_after[index].url;

        //每一次编辑都会向服务器提交更改请求
        $.ajax({
                        url:url,
                        type:"PUT",
                        dataType:"json",
                        data:todos_after[index],
                        async:false,
                        success: function(return_value){
                                    //window.location.reload();
                                },
                        error: function(XMLHttpRequest, textStatus, errorThrown) {
                                    alert(XMLHttpRequest.status);
                        }
                    });

        this.setState({
          todos: todos_after
        });

    }

    render(){

        var todos = this.state.todos;
        const max_todos_per_page=5;
        const max_page = Math.ceil(todos.length/max_todos_per_page);



        if (this.props.sort_method==="0"){
            todos.sort((todoA, todoB) => todoB.importance - todoA.importance);
        }
        else if (this.props.sort_method==="1"){
            todos.sort((todoA, todoB) => new Date(todoB.expire_date)>new Date(todoA.expire_date)?1:-1);
        }

        var current_page = (this.props.pages>max_page)?max_page:((this.props.pages>0)?this.props.pages:1);
        todos = todos.slice(max_todos_per_page*(current_page-1),max_todos_per_page*(current_page-1)+5);

        var todolist = todos.map(todo => <TodoDetail key = {todo.id} todo = {todo} handleInputChange={this.handleInputChange}/>);

        return(
            <div className = "content-block parallax" id="contact">
            <div class="container">
                {todolist}
                <Page current_page = {current_page} max_page = {max_page} handlePageChange={this.props.handlePageChange}/>
            </div>
            </div>
        )
    }

    componentDidMount(){
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


export default App;
