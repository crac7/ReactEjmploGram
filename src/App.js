import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase';
import FileUpload from './FileUpload';

class App extends Component {
  constructor(){
      super();
      this.state={
        user:null,
        pictures:[]
      };
      this.handleAuth=this.handleAuth.bind(this);
      this.handleLogout=this.handleLogout.bind(this);
      this.renderLoginButton=this.renderLoginButton.bind(this);
      this.handleonUpload=this.handleonUpload.bind(this);
  }

  componentWillMount(){
    firebase.auth().onAuthStateChanged(user=>{
      this.setState({user});
    });

    firebase.database().ref('pictures').on('child_added', snapshot=>{
      this.setState({
        pictures: this.state.pictures.concat(snapshot.val())
      });
    });
  }

  handleAuth()
  {
    const provider= new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(result=> console.log(`${result.user.email} ha iniciado session`))
    .catch(error=>console.log(`Error: ${error}`))
  }
  handleLogout(){
    firebase.auth().signOut()
    .then(result=> console.log(`Has salido`))
    .catch(error=>console.log(`Error: ${error}`))
  }

  handleonUpload(event){
    const file =event.target.files[0];
    const storageREf= firebase.storage().ref(`/Fotos/${file.name}`);
    //const task =storageREf.put(file);
      var task = storageREf.child(`${file.name}`).put(file);

    task.on('state_changed', snapshot=>{
      let percentage=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
      this.setState({
        uploadValue:percentage
      })
    },error=>{
      console.log(error.message)
    },()=>{
    storageREf.child(file.name).getDownloadURL().then((url) => {
        const record={
          photoURL: this.state.user.photoURL,
          displayName:  this.state.user.displayName,
          image: task.snapshot.downloadURL
        };
          record.image=url

          const dbRef= firebase.database().ref('pictures');
          const newPicture =dbRef.push();
          newPicture.set(record);
       })


    });
  }
    renderLoginButton(){
      ////si esta logueado
      if(this.state.user){
        return(
              <div className="card-body">
                  <img width="100" src={this.state.user.photoURL} alt={this.state.user.displayName}/>
                  <div>Hola  {this.state.user.displayName}  </div>
                  <button  type="button" className="btn btn-danger" onClick={this.handleLogout}>Salir</button>
                  <FileUpload onUpload={this.handleonUpload}/>
                  {
                    this.state.pictures.map((picture,i)=>(
                     <div  className="card text-white bg-info mb-3"  style={{width: '18rem'}} key={i}>
                           <div className="card-header">
                             <img className="card-img-top"  src={picture.image} alt={this.state.user.displayName}/>
                            </div>
                           <div className="card-body">
                             <h5 className="card-title">{picture.displayName}</h5>
                              <img width="25" src={picture.photoURL} alt={picture.displayName} className="rounded-circle"/>
                           </div>
                      </div>
                    )).reverse()
                  }
           </div>
        );
      }else{
          //si no esta Logueado
        return(<button onClick={this.handleAuth}>Login con Google</button>);
      }

    }

  render() {
    return (
      <div className="App">
        <div className="App-header">
        <h5 className="card-title">Bienvenido aEjemplogram</h5>
        </div>
        <div className="App-intro">
         { this.renderLoginButton() }
        </div>
      </div>
    );
  }
}

export default App;
