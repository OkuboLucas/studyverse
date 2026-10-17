// Recupera as tarefas salvas no navegador
let tarefas = [];
const tarefasSalvas = localStorage.getItem("tarefas");

if (tarefasSalvas) {
    tarefas = JSON.parse(tarefasSalvas);
}


// Captura os elementos do HTML
const formulario = document.getElementById("form-tarefa");
const campoTarefa = document.getElementById("nome-tarefa");
const listaTarefas = document.getElementById("tarefas-lista");


// Cria visualmente uma tarefa
function criarItemTarefa(tarefa) {

    const item = document.createElement("li");

    // Define o nome da tarefa
    const nome = document.createElement("span");
    nome.textContent = tarefa.nome;

    const botaoExcluir = document.createElement("button");
    botaoExcluir.textContent = "Excluir";

    botaoExcluir.addEventListener("click", function(evento){
        evento.stopPropagation();

        const indice = tarefas.indexOf(tarefa);
        tarefas.splice(indice, 1);
        localStorage.setItem(
            "tarefas",
            JSON.stringify(tarefas)
        );
        
        item.remove();
    });

    item.appendChild(nome);
    item.appendChild(botaoExcluir);

    // Verifica se a tarefa já está concluída
    if (tarefa.concluida) {
        item.classList.add("concluida");
    }

    // Permite marcar e desmarcar a tarefa
    item.addEventListener("click", function() {

        tarefa.concluida = !tarefa.concluida;

        item.classList.toggle(
            "concluida",
            tarefa.concluida
        );

        // Atualiza o localStorage
        localStorage.setItem(
            "tarefas",
            JSON.stringify(tarefas)
        );
    });

    return item;
}


// Mostra as tarefas salvas quando a página é carregada
function mostrarTarefas() {

    listaTarefas.innerHTML = "";

    tarefas.forEach(function(tarefa) {

        const item = criarItemTarefa(tarefa);

        listaTarefas.appendChild(item);
    });
}


// Mostra as tarefas assim que a página carrega
mostrarTarefas();


// Cadastra uma nova tarefa
formulario.addEventListener("submit", function(evento) {

    // Impede o recarregamento automático da página
    evento.preventDefault();

    // Obtém o texto digitado
    const nomeTarefa = campoTarefa.value.trim();

    // Impede o cadastro de uma tarefa vazia
    if (nomeTarefa === "") {
        return;
    }

    // Cria o objeto da nova tarefa
    const novaTarefa = {
        nome: nomeTarefa,
        concluida: false
    };

    // Adiciona a nova tarefa ao array
    tarefas.push(novaTarefa);

    // Salva as tarefas no navegador
    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );

    // Cria o elemento visual da nova tarefa
    const item = criarItemTarefa(novaTarefa);

    // Adiciona a tarefa à lista
    listaTarefas.appendChild(item);

    // Limpa o campo
    campoTarefa.value = "";

    // Coloca o cursor novamente no campo
    campoTarefa.focus();
});