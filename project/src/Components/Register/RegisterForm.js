import React from 'react';

class RegisterForm extends React.Component {
    constructor(){
        super()
        this.state = {
            email :'',
            password :'',
            name :''
        }
    }
    onNameChange = (event) =>{
        this.setState({name:event.target.value})
    }
    onEmailChange = (event) =>{
        this.setState({email:event.target.value})
    }
    onPasswordChange = (event) =>{
        this.setState({password:event.target.value})
    }
    onSubmitSignIn = () =>{
        
        fetch('http://localhost:3000/register',{
            method : 'post',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({
                email : this.state.email,
                password : this.state.password,
                name : this.state.name
            })
        }).then(response=>response.json())
        .then(user =>{
            if(user){
                this.props.loadUser(user)
                this.props.onRouteChange('home')
            }
        })
        //this.props.onRouteChange('home')
    }
    render(){
        return(
            <main className="pa4 black-80">
            <div className="measure center">
                <fieldset id="Register" className="ba b--transparent ph0 mh0">
                <legend className="f2 fw6 ph0 mh0">Register</legend>
                <div className="mt3">
                    <label className="db fw6 lh-copy f6" htmlFor="name">Name</label>
                    <input onChange={this.onNameChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 h-100" type="text" name="name"  id="name" />
                </div>
                <div className="mt3">
                    <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                    <input onChange={this.onEmailChange} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 h-100" type="email" name="email-address"  id="email-address" />
                </div>
                <div className="mv3">
                    <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                    <input onChange={this.onPasswordChange} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100 h-100" type="password" name="password"  id="password" />
                </div>
                </fieldset>
                <div className="">
                <input onClick={this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent dim pointer f6 dib" type="submit" value="Register" />
                
                </div>
                <div className="lh-copy mt3 dib">
                <p className="f6 link black db">if you already have an account ,sign in <span onClick={this.onSubmitSignIn} className="f6 b link black db dim pointer">here</span></p>
                </div>
            </div>
        </main>
        );
    }
}
// () => onRouteChange('signIn')
export default RegisterForm;