"use babel";

import { useModal, actions } from "inkdrop";
import { io } from "socket.io-client";


let modal
const socket = io("ws://localhost:3000");
socket.on('connect', () => {
    console.log('Successfully connected!');
    
  });
  socket.io.on("error", (error) => {
   // console.log("SOcket err");
    modal.close()
  });


const askFunction =async () => {
    if (!socket.connected){

        inkdrop.notifications.addError('Writer AI', { dismissable: true, detail: "Cant Connect to dalai server. Please start Dalai server and restart Inkdrop" })

        return
    }
    console.log("ask funcction");
    const { editingNote } = inkdrop.store.getState()
    const noteBody = editingNote.body
    modal.show()
    let prompt=`### Instruction:
${inkdrop.config.get('writer-ai.instruction')}

${noteBody}

### Response:
`



  socket.emit("request",{
    seed: -1,
    threads: inkdrop.config.get('writer-ai.threads'),
    n_predict: inkdrop.config.get('writer-ai.n_predict'),
    top_k: 40,
    top_p:0.9,
    temp: 0.8,
    repeat_last_n: 64,
    repeat_penalty: 1.3,
    skip_end:true,
    debug: false,
    models: ["alpaca.7B"],
    model: inkdrop.config.get('writer-ai.model') ,
    prompt: prompt, //.split("\n").join("\\n")
  } );
    let count=0
    let flag = false;
    function  callonce(){
        if (!flag) {
            inkdrop.store.dispatch(actions.editingNote.update({ body: (inkdrop.store.getState()).editingNote.body+"\nAI:"  }))
            inkdrop.store.dispatch(actions.editor.change(true))
            flag = true;
            modal.close()
          }
    }

    socket.on("result", (data) => {
        let token=data["response"]
        count+=token.length
        // console.log(token);
        if(count>=prompt.length){
            
            inkdrop.store.dispatch(actions.editingNote.update({ body: (inkdrop.store.getState()).editingNote.body+token }))
            inkdrop.store.dispatch(actions.editor.change(true))
            callonce()
        }
       
    });

   
}


inkdrop.commands.add(document.body, {
    "ai:alpaca7b": askFunction,
})

const askAiMessageDialog = (props) => {
    modal = useModal();
    const { Dialog } = inkdrop.components.classes;

    return (
        <Dialog {...modal.state} onBackdropClick={modal.close} style="max-width: 300px;">
            <Dialog.Title>Writer Ai</Dialog.Title>
            <Dialog.Content>Processing the request. Please wait.</Dialog.Content>
            <Dialog.Actions>
                <button className="ui button" onClick={modal.close}>
                    Close
                </button>
            </Dialog.Actions>
        </Dialog>
    );
}


 export default askAiMessageDialog;