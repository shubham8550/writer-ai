"use babel";

 import askAiMessageDialog from "./writer-ai-main";

module.exports = {
    config : {
        instruction: {
            title: 'Write An Instruction For AI model(you can ask it to translate,autocomplete or anything you want)',
            type: 'string',
            default: 'Can you explain this concept in simple terms?'
        },
        model: {
            title: 'Select LLM Model',
            type: 'string',
            default:  'alpaca.7B' ,
            enum: [ 'alpaca.7B' ]
        },
        n_predict: {
            title: 'Amount Of Token ..To Predict',
            type: 'integer',
            default: 75,
            minimum: 1
        },
        threads: {
            title: 'Number Threads Model Should Use?',
            type: 'integer',
            default: 8,
            minimum: 1
        }
    },

    activate() {
    console.log("activate funcction2");

        inkdrop.components.registerClass(askAiMessageDialog);
        inkdrop.layouts.addComponentToLayout("modal", "askAiMessageDialog");
    },

    deactivate() {
        console.log("deactivate funcction");
        inkdrop.layouts.removeComponentFromLayout(
            "modal",
            "askAiMessageDialog"
        );
        inkdrop.components.deleteClass(askAiMessageDialog);
    },
};
