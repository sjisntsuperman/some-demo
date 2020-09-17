export function fetch(data){
    return new Promise((resolve,reject)=>{
        const XMLRequest=new XMLHttpRequest();
        const form = new FormData();
        // form.add();
        form.add('data', data);
        if(XMLRequest.responseType=='200'){
            XMLRequest.setRequestHeader+='type: POST';
            XMLRequest.send();
        }
    })
}