const APIURL = 'https://1mwkmwp9ud.execute-api.ca-central-1.amazonaws.com/dev/memo/'
//import * as apiCalls from './api';
//  async loadTodos(){
//     let todos = await apiCalls.getTodos();
//     this.setState({todos});
//  }

export class APICalls {
  constructor(token) {
    this.token = token;
  }
  createAMemo = async (newMemo={}) => {
    console.log(this.token);
    return fetch(APIURL, {
          method: 'post',
          mode: 'cors',
          headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
          }),
          body: JSON.stringify(newMemo)
    })
    .then(resp => {
      if(!resp.ok) {
        if(resp.status >=400 && resp.status < 500) {
          resp.json().then(data => {
            return {errorMessage: data.message};
            // throw err;
          })
        } else {
          return {errorMessage: 'Please try again later, server is not responding'};
          // throw err;
        }
      }
      return resp.json()
    }) 
  }

  loadAMemo = async (id) => {
    return fetch(APIURL+id, {
          method: 'get',
          mode: 'cors',
          headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
          })
      })
      .then(resp => {
        if(!resp.ok) {
          if(resp.status >=400 && resp.status < 500) {
            return resp.json().then(data => {
              let err = {errorMessage: data.message};
              throw err;
            })
          } else {
            let err = {errorMessage: 'Please try again later, server is not responding'};
            throw err;
          }
        }
        return resp.json()
     }) 
  }  
  
  loadAllMemos = async () => {
    return fetch(APIURL, {
          method: 'get',
          mode: 'cors',
          headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
          })
      })
      .then(resp => {
        if(!resp.ok) {
          if(resp.status >=400 && resp.status < 500) {
            return resp.json().then(data => {
              let err = {errorMessage: data.message};
              throw err;
            })
          } else {
            let err = {errorMessage: 'Please try again later, server is not responding'};
            throw err;
          }
        }
        return resp.json()
     }) 
  }

  updateAMemo = async (memo) => {
    const {title, body, posX, posY, width, height, isHidden, isDeleted} = memo
    return fetch(APIURL+memo.id, {
          method: 'PATCH', // be careful, "PATCH" is case-sensitive
          mode: 'cors',
          headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
          }),
          body: JSON.stringify({title, body, posX, posY, width, height, isHidden, isDeleted})
      })
      .then(resp => {
        if(!resp.ok) {
          if(resp.status >=400 && resp.status < 500) {
            return resp.json().then(data => {
              let err = {errorMessage: data.message};
              throw err;
            })
          } else {
            let err = {errorMessage: 'Please try again later, server is not responding'};
            throw err;
          }
        }
        return resp.json()
     }) 
  }

  deleteAMemo = async (id) => {
    return fetch(APIURL+id, {
          method: 'delete',
          mode: 'cors',
          headers: new Headers({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
          })
      })
      .then(resp => {
        if(!resp.ok) {
          if(resp.status >=400 && resp.status < 500) {
            return resp.json().then(data => {
              let err = {errorMessage: data.message};
              throw err;
            })
          } else {
            let err = {errorMessage: 'Please try again later, server is not responding'};
            throw err;
          }
        }
        return resp.json()
     }) 
  }
  
  getUploadUrl = async () => {
    return fetch(APIURL+"attachment", {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
      })
    })      
    .then(resp => {
      if(!resp.ok) {
        if(resp.status >=400 && resp.status < 500) {
          return resp.json().then(data => {
            let err = {errorMessage: data.message};
            throw err;
          })
        } else {
          let err = {errorMessage: 'Please try again later, server is not responding'};
          throw err;
        }
      }
      return resp.json()
   }) 
  }
    
  uploadFile = async (uploadUrl, file) => {
    await axios.put(uploadUrl, file)
  }
  
  getAccessImageUrl = async () => {
    return fetch(APIURL+"imageUrl", {
      method: 'get',
      mode: 'cors',
      headers: new Headers({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.token
      })
    })      
    .then(resp => {
      if(!resp.ok) {
        if(resp.status >=400 && resp.status < 500) {
          return resp.json().then(data => {
            let err = {errorMessage: data.message};
            throw err;
          })
        } else {
          let err = {errorMessage: 'Please try again later, server is not responding'};
          throw err;
        }
      }
      return resp.json()
   }) 
  }

}


