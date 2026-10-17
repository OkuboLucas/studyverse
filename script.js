let tarefas = [];

const formulario = document.getElementById("form-tarefa");
const campoTarefa = document.getElementById("nome-tarefa");
const listaTarefas = document.getElementById("tarefas-lista");

formulario.addEventListener("submit", function(evento) {

    // Impede o recarregamento automático da página
    evento.preventDefault();

    // Obtém o texto digitado e remove espaços das extremidades
    const nomeTarefa = campoTarefa.value.trim();

    if (nomeTarefa === "") {
        return;
    }

    // Cria um novo item HTML para representar a tarefa
    const novaTarefa = {
        nome: nomeTarefa,
        concluida: false
    };
    tarefas.push(novaTarefa);
    
    const item = document.createElement("li");
    item.textContent = novaTarefa.nome;

    
item.addEventListener("click", function() {
    novaTarefa.concluida = !novaTarefa.concluida;
    item.classList.toggle("concluida", novaTarefa.concluida);
});

    // Adiciona o item à lista de tarefas
    listaTarefas.appendChild(item);

    // Limpa o campo após cadastrar a tarefa
    campoTarefa.value = "";
    campoTarefa.focus();
});
